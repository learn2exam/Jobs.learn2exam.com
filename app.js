

  
  
  // ======================================
// E2-1 — GLOBAL DOM & DEPENDENCY SAFETY
// ======================================

const html = document.documentElement;

// --------------------------------------
// Safe DOM Getter
// --------------------------------------
function getElement(id) {
    return document.getElementById(id);
}

// --------------------------------------
// Hero Search
// --------------------------------------
const jobSearch     = getElement("jobSearch");
const heroCategory  = getElement("heroCategory");
const heroState     = getElement("heroState");
const heroSearchBtn = getElement("heroSearchBtn");

// --------------------------------------
// Header Search
// --------------------------------------
const headerSearch        = getElement("headerSearch");
const headerSearchBtn     = getElement("headerSearchBtn");
const headerSearchWrapper = getElement("headerSearchWrapper");
const headerSearchClose   = getElement("headerSearchClose");

// --------------------------------------
// Desktop Filters
// --------------------------------------
const filterCategory       = getElement("filterCategory");
const filterDepartment     = getElement("filterDepartment");
const filterQualification  = getElement("filterQualification");
const filterState          = getElement("filterState");
const filterJobType        = getElement("filterJobType");
const filterSalary         = getElement("filterSalary");
const filterLastDate       = getElement("filterLastDate");

const applyFilters         = getElement("applyFilters");
const resetFilters         = getElement("resetFilters");
const activeFilterCount    = getElement("activeFilterCount");

// --------------------------------------
// Mobile Filters
// --------------------------------------
const mobileFilterCategory      = getElement("mobileFilterCategory");
const mobileFilterDepartment    = getElement("mobileFilterDepartment");
const mobileFilterQualification = getElement("mobileFilterQualification");
const mobileFilterState         = getElement("mobileFilterState");
const mobileFilterJobType       = getElement("mobileFilterJobType");
const mobileFilterSalary        = getElement("mobileFilterSalary");
const mobileFilterLastDate      = getElement("mobileFilterLastDate");

const mobileApplyFilters        = getElement("mobileApplyFilters");
const mobileResetFilters        = getElement("mobileResetFilters");

// --------------------------------------
// Mobile Menu
// --------------------------------------
const menuBtn     = getElement("menuBtn");
const closeMenu   = getElement("closeMenu");
const mobileMenu  = getElement("mobileMenu");
const menuOverlay = getElement("menuOverlay");

// --------------------------------------
// Theme
// --------------------------------------
const themeBtn  = getElement("themeBtn");
const themeIcon = getElement("themeIcon");

// --------------------------------------
// Filter Drawer
// --------------------------------------
const openFilterDrawer  = getElement("openFilterDrawer");
const closeFilterDrawer = getElement("closeFilterDrawer");
const filterDrawer      = getElement("filterDrawer");
const filterOverlay     = getElement("filterOverlay");

// --------------------------------------
// Pagination & Sorting
// --------------------------------------
const prevPageBtn   = getElement("prevPage");
const nextPageBtn   = getElement("nextPage");
const emptyResetBtn = getElement("emptyResetBtn");
const sortJobs      = getElement("sortJobs");

// --------------------------------------
// Share Menu
// --------------------------------------
const shareMenu        = getElement("shareMenu");
const shareMenuClose   = getElement("shareMenuClose");
const shareMenuOverlay = getElement("shareMenuOverlay");

const shareWhatsapp = getElement("shareWhatsapp");
const shareTelegram = getElement("shareTelegram");
const shareTwitter  = getElement("shareTwitter");
const shareCopy     = getElement("shareCopy");

// --------------------------------------
// Job List & Results UI
// --------------------------------------
const jobList              = getElement("jobList");
const pageNumbersContainer = getElement("pageNumbers");
const paginationContainer  = getElement("paginationContainer");
const emptyState           = getElement("emptyState");
const jobCount             = getElement("jobCount");
const scrollProgress       = getElement("scrollProgress");
  
  
  // ======================================
// 2. CORE APPLICATION VARIABLES
// ======================================

// --------------------------------------
// Job Data & Pagination
// --------------------------------------
let allJobs = [];
let debounceTimer;
const CARDS_PER_PAGE = 2;

// ======================================
// App Initialization
// ======================================
function initializeApp() {

    // 1. Saved AppState load
    restoreAppState();

    // 2. Job data से search data तैयार
   // buildSearchData();

    // 3. Central State → DOM Inputs
    syncStateToInputs();

    // 4. Bookmarks
    loadBookmarks();
    setupBookmarkButtons();
    updateBookmarkIcons();

    // 5. Apply saved filters
    applySearchFilters();
}


// ======================================
// DOM Ready
// ======================================
window.addEventListener("DOMContentLoaded", () => {
    loadTheme();
});


// ======================================
// Fetch Job Data from JSON
// ======================================
fetch('assets/data/jobs.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    })
    .then(data => {
        allJobs = data;
        initializeApp();
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });








    
    
    
// --------------------------------------
// Bookmark State
// --------------------------------------
let bookmarkedJobs = [];
 
// ======================================
// 3. APPLICATION STATE
// ======================================
const AppState = {
    currentPage: 1,
    filteredJobs: [],
    searchKeyword: "",
    sortBy: "latest",
    filters: {
        heroCategory: "",
        heroState: "",
        category: "",
        department: "",
        qualification: "",
        state: "",
        jobType: "",
        salary: "",
        lastDate: ""
    }
};  


  
    
// ======================================
// LOCAL STORAGE MANAGER
// ======================================

const StorageManager = {

    save(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch (err) {
            console.warn("Storage Save Failed", err);
        }
    },

    load(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);

            return value
                ? JSON.parse(value)
                : defaultValue;

        } catch (err) {
            console.warn("Storage Load Failed", err);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (err) {
            console.warn("Storage Remove Failed", err);
        }
    }

};

// --------------------------------------
// Share State
// --------------------------------------
let currentShareData = null;

  
  
  
// ======================================
// 11. APPLICATION STATE PERSISTENCE
// ====================================== 
function saveAppState() {
    StorageManager.save("learn2exam_app_state", AppState);
}
function restoreAppState() {

    const savedState =
        StorageManager.load("learn2exam_app_state");

    if (!savedState) return;

    Object.assign(AppState, savedState);
}
    
// ======================================
// 12. THEME MANAGEMENT
// ======================================
function updateThemeIcon() {
    if (!themeIcon) return;

    if (html.classList.contains("dark")) {
        themeIcon.className = "fa-solid fa-sun";
    } else {
        themeIcon.className = "fa-solid fa-moon";
    }
}
    
function enableDarkMode() {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
    updateThemeIcon();
}
function enableLightMode() {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
    updateThemeIcon();
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        enableDarkMode();
        return;
    }
    if (savedTheme === "light") {
        enableLightMode();
        return;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
}

// ======================================
// 13. MOBILE MENU
// ======================================

function openMenu() {

    if (!mobileMenu || !menuOverlay) return;

    mobileMenu.classList.remove("-translate-x-full");
    mobileMenu.classList.add("translate-x-0");

    menuOverlay.classList.remove("hidden");

    setTimeout(() => {
        if (!menuOverlay) return;

        menuOverlay.classList.remove("opacity-0");
        menuOverlay.classList.add("opacity-100");
    }, 10);

    document.body.classList.add("overflow-hidden");
}

function closeMobileMenu() {

    if (!mobileMenu || !menuOverlay) return;

    mobileMenu.classList.remove("translate-x-0");
    mobileMenu.classList.add("-translate-x-full");

    menuOverlay.classList.remove("opacity-100");
    menuOverlay.classList.add("opacity-0");

    setTimeout(() => {
        if (!menuOverlay) return;

        menuOverlay.classList.add("hidden");
    }, 300);

    document.body.classList.remove("overflow-hidden");
}
    
// ======================================
// 14. FILTER DRAWER
// ======================================

function showFilterDrawer() {

    if (!filterDrawer || !filterOverlay) return;

    filterDrawer.classList.remove("-translate-x-full");
    filterDrawer.classList.add("translate-x-0");

    filterOverlay.classList.remove("hidden");

    document.body.classList.add("overflow-hidden");
}

function hideFilterDrawer() {

    if (!filterDrawer || !filterOverlay) return;

    filterDrawer.classList.remove("translate-x-0");
    filterDrawer.classList.add("-translate-x-full");

    filterOverlay.classList.add("hidden");

    document.body.classList.remove("overflow-hidden");
}


 
function buildSearchData() {
    allJobs = JOB_DATA.map(job => ({
        ...job
    }));

    console.log("Search Data Ready", allJobs);
}
 
  
  
  // ======================================
// E2-2D — JOB CARD RENDERER
// ======================================

function renderJobCard(job) {
    const card = document.createElement("article");

    card.className =
        "job-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden";

    card.dataset.id = job.id;

    card.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div class="flex gap-4">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 text-2xl">
                    <i class="fa-solid fa-building-columns"></i>
                </div>

                <div>
                    <div class="flex flex-wrap gap-2 mb-2">
                        <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            ${job.status}
                        </span>

                        <span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                            Last Date Soon
                        </span>
                    </div>

                    <h3 class="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                        ${job.title}
                    </h3>

                    <p class="mt-1 text-slate-500 dark:text-slate-400">
                        ${job.department}
                    </p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div>
                <p class="text-xs text-slate-500">Qualification</p>
                <h4 class="mt-1 font-semibold">
                    ${job.qualification}
                </h4>
            </div>

            <div>
                <p class="text-xs text-slate-500">Total Posts</p>
                <h4 class="mt-1 font-semibold">
                    ${job.posts}
                </h4>
            </div>

            <div>
                <p class="text-xs text-slate-500">Location</p>
                <h4 class="mt-1 font-semibold">
                    ${job.state}
                </h4>
            </div>

            <div>
                <p class="text-xs text-slate-500">Last Date</p>
                <h4 class="mt-1 font-semibold text-red-600">
                    ${job.lastdate}
                </h4>
            </div>

        </div>

        <div class="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">

            <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                    ${job.department}
                </span>

                <span class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                    ${job.qualification}
                </span>

                <span class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                    Government Job
                </span>
            </div>

            <span class="text-sm text-slate-500">
                Posted: Today
            </span>

        </div>

        <div class="job-actions mt-6 flex flex-col sm:flex-row gap-3">

            <a href="job-details.html?id=${job.id}"
               class="w-full sm:flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center transition">

                <i class="fa-solid fa-eye mr-2"></i>
                View Details

            </a>

            <a href="#"
               class="w-full sm:flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center transition">

                <i class="fa-solid fa-paper-plane mr-2"></i>
                Apply Now

            </a>

            <button
    data-job-id="${job.id}"
    class="bookmarkBtn w-full sm:w-11 h-11 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-yellow-100 dark:hover:bg-slate-800 transition">

                <i class="fa-regular fa-bookmark"></i>

            </button>

            <button
    data-job-id="${job.id}"
    class="shareBtn w-full sm:w-11 h-11 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-800 transition"
    title="Share Job"
    aria-label="Share Job">

                <i class="fa-solid fa-share-nodes"></i>

            </button>

        </div>
    `;

    return card;
}
  
  
// ======================================
// SEARCH MODULE
// Production-Level Search Architecture
// ======================================

// --------------------------------------
// Mobile Search Detection
// --------------------------------------
function isMobileSearch() {
    return window.innerWidth < 768;
}


// --------------------------------------
// Open Header Search
// UI Responsibility Only
// --------------------------------------
function openHeaderSearch() {

    if (!isMobileSearch()) return;

    if (
        !headerSearchWrapper ||
        !headerSearchBtn ||
        !headerSearchClose ||
        !headerSearch
    ) {
        return;
    }

    headerSearchWrapper.classList.remove("hidden");
    headerSearchWrapper.classList.add("block");

    headerSearchBtn.classList.add("hidden");
    headerSearchClose.classList.remove("hidden");

    setTimeout(() => {

        if (headerSearch) {
            headerSearch.focus();
        }

    }, 150);
}


// --------------------------------------
// Hide Header Search UI
// UI Responsibility ONLY
//
// IMPORTANT:
// AppState.searchKeyword को touch नहीं करता.
// Search inputs को clear नहीं करता.
// Search results को reset नहीं करता.
// --------------------------------------
function hideHeaderSearchUI() {

    if (!isMobileSearch()) return;

    if (
        !headerSearchWrapper ||
        !headerSearchBtn ||
        !headerSearchClose
    ) {
        return;
    }

    headerSearchWrapper.classList.add("hidden");
    headerSearchWrapper.classList.remove("block");

    headerSearchBtn.classList.remove("hidden");
    headerSearchClose.classList.add("hidden");
}


// --------------------------------------
// Clear Search
// State Responsibility
//
// X Button इसी function को use करेगा.
// --------------------------------------
function clearSearch() {

    AppState.searchKeyword = "";
    AppState.currentPage = 1;

    // Persist Central State
    saveAppState();

    // AppState → DOM
    syncStateToInputs();

    // Apply Central State
    applySearchFilters();
}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    
function syncFilterInputs(source) {
    if (source === 'desktop') {
        if(mobileFilterCategory && filterCategory) mobileFilterCategory.value = filterCategory.value;
        if(mobileFilterDepartment && filterDepartment) mobileFilterDepartment.value = filterDepartment.value;
        if(mobileFilterQualification && filterQualification) mobileFilterQualification.value = filterQualification.value;
        if(mobileFilterState && filterState) mobileFilterState.value = filterState.value;
        if(mobileFilterJobType && filterJobType) mobileFilterJobType.value = filterJobType.value;
        if(mobileFilterSalary && filterSalary) mobileFilterSalary.value = filterSalary.value;
        if(mobileFilterLastDate && filterLastDate) mobileFilterLastDate.value = filterLastDate.value;
    } else if (source === 'mobile') {
        if(filterCategory && mobileFilterCategory) filterCategory.value = mobileFilterCategory.value;
        if(filterDepartment && mobileFilterDepartment) filterDepartment.value = mobileFilterDepartment.value;
        if(filterQualification && mobileFilterQualification) filterQualification.value = mobileFilterQualification.value;
        if(filterState && mobileFilterState) filterState.value = mobileFilterState.value;
        if(filterJobType && mobileFilterJobType) filterJobType.value = mobileFilterJobType.value;
        if(filterSalary && mobileFilterSalary) filterSalary.value = mobileFilterSalary.value;
        if(filterLastDate && mobileFilterLastDate) filterLastDate.value = mobileFilterLastDate.value;
    }
} 
    // ======================================
// E2-2A-5B — STATE → DOM SYNCHRONIZATION
// Production-Level Input Sync
// ======================================

function syncStateToInputs() {

    // ==================================
    // 1. SEARCH INPUTS
    // ==================================

    const searchValue =
        AppState.searchKeyword || "";

    if (jobSearch) {
        jobSearch.value = searchValue;
    }

    if (headerSearch) {
        headerSearch.value = searchValue;
    }


    // ==================================
    // 2. HERO FILTERS
    // ==================================

    if (heroCategory) {
        heroCategory.value =
            AppState.filters.heroCategory || "";
    }

    if (heroState) {
        heroState.value =
            AppState.filters.heroState || "";
    }


    // ==================================
    // 3. DESKTOP FILTERS
    // ==================================

    if (filterCategory) {
        filterCategory.value =
            AppState.filters.category || "";
    }

    if (filterDepartment) {
        filterDepartment.value =
            AppState.filters.department || "";
    }

    if (filterQualification) {
        filterQualification.value =
            AppState.filters.qualification || "";
    }

    if (filterState) {
        filterState.value =
            AppState.filters.state || "";
    }

    if (filterJobType) {
        filterJobType.value =
            AppState.filters.jobType || "";
    }

    if (filterSalary) {
        filterSalary.value =
            AppState.filters.salary || "";
    }

    if (filterLastDate) {
        filterLastDate.value =
            AppState.filters.lastDate || "";
    }


    // ==================================
    // 4. MOBILE FILTERS
    // ==================================

    if (mobileFilterCategory) {
        mobileFilterCategory.value =
            AppState.filters.category || "";
    }

    if (mobileFilterDepartment) {
        mobileFilterDepartment.value =
            AppState.filters.department || "";
    }

    if (mobileFilterQualification) {
        mobileFilterQualification.value =
            AppState.filters.qualification || "";
    }

    if (mobileFilterState) {
        mobileFilterState.value =
            AppState.filters.state || "";
    }

    if (mobileFilterJobType) {
        mobileFilterJobType.value =
            AppState.filters.jobType || "";
    }

    if (mobileFilterSalary) {
        mobileFilterSalary.value =
            AppState.filters.salary || "";
    }

    if (mobileFilterLastDate) {
        mobileFilterLastDate.value =
            AppState.filters.lastDate || "";
    }


    // ==================================
    // 5. SORT
    // ==================================

    if (sortJobs) {
        sortJobs.value =
            AppState.sortBy || "latest";
    }


    // ==================================
    // 6. UI STATE
    // ==================================

    updateFilterCount();


    // ==================================
    // 7. DEBUG
    // ==================================

    console.log(
        "E2-2A-5B — AppState → DOM synchronized"
    );
} 
  
  
  
    // ======================================
// CENTRAL SEARCH STATE
// DOM → AppState → DOM
// ======================================
function handleSearchInput(source) {

    const input =
        source === "header"
            ? headerSearch
            : jobSearch;

    if (!input) return;

    // ----------------------------------
    // DOM → Central AppState
    // ----------------------------------
    AppState.searchKeyword =
        input.value.trim().toLowerCase();

    // Search change → first page
    AppState.currentPage = 1;

    // ----------------------------------
    // Persist Central State
    // ----------------------------------
    saveAppState();

    // ----------------------------------
    // AppState → DOM
    // ----------------------------------
    syncStateToInputs();

    // ----------------------------------
    // Central Search Pipeline
    // ----------------------------------
    applySearchFilters();
}
    
    
    
    
    function updateFilterCount() {

    let count = 0;

    const filters = AppState.filters;

    [
        filters.category,
        filters.department,
        filters.qualification,
        filters.state,
        filters.jobType,
        filters.salary,
        filters.lastDate
    ].forEach(value => {

        if (value !== "") {
            count++;
        }

    });

    if (activeFilterCount) {
        activeFilterCount.textContent = count + " Active";
    }
}
  
  
  
// ======================================
// SALARY PARSER
// ======================================

function parseSalary(value) {
    return parseInt(
        value.replace(/[^0-9]/g, ""),
        10
    );
}
  
  
// ======================================
// 16. JOB FILTER ENGINE
// ======================================
function filterJobs(jobs, keyword, filters) {

    const {
        heroCatVal,
        heroStateVal,
        catVal,
        deptVal,
        qualVal,
        stateVal,
        typeVal,
        salVal,
        dateVal
    } = filters;

    return jobs.filter((job) => {

        if (keyword) {
            const matchesTitle =
                job.title.toLowerCase().includes(keyword);

            const matchesDept =
                job.department.toLowerCase().includes(keyword);

            const matchesQual =
                job.qualification.toLowerCase().includes(keyword);

            if (!matchesTitle && !matchesDept && !matchesQual) {
                return false;
            }
        }

        if (heroCatVal && job.category !== heroCatVal) return false;
        if (heroStateVal && job.state !== heroStateVal) return false;

        if (catVal && job.category !== catVal) return false;
        if (deptVal && job.department !== deptVal) return false;
        if (qualVal && job.qualification !== qualVal) return false;
        if (stateVal && job.state !== stateVal) return false;
        if (typeVal && job.jobtype !== typeVal) return false;

        if (salVal) {
            const minSalary = parseSalary(salVal);

            if (job.salary < minSalary) return false;
        }

        if (dateVal) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const jobDate = new Date(job.lastdate);
            jobDate.setHours(0, 0, 0, 0);

            if (isNaN(jobDate.getTime())) {

                if (
                    dateVal === "Today" &&
                    job.lastdate.toLowerCase() !== "today"
                ) {
                    return false;
                }

            } else {

                const diffTime = jobDate - today;

                const diffDays =
                    Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                    );

                if (dateVal === "Today" && diffDays !== 0)
                    return false;

                if (
                    dateVal === "This Week" &&
                    (diffDays < 0 || diffDays > 7)
                )
                    return false;

                if (
                    dateVal === "This Month" &&
                    (diffDays < 0 || diffDays > 30)
                )
                    return false;
            }
        }

        return true;
    });
}
    
// ======================================
// 17. JOB SORTING
// ======================================
function sortJobsList(jobs, sortVal) {

    const sortedJobs = [...jobs];

    if (sortVal === "salary") {

        sortedJobs.sort(
            (a, b) => b.salary - a.salary
        );

    } else if (sortVal === "salaryLow") {

        sortedJobs.sort(
            (a, b) => a.salary - b.salary
        );

    } else if (sortVal === "posts") {

        sortedJobs.sort(
            (a, b) => b.posts - a.posts
        );

    } else if (sortVal === "az") {

        sortedJobs.sort(
            (a, b) =>
                a.title.localeCompare(b.title, "hi")
        );

    } else if (sortVal === "za") {

        sortedJobs.sort(
            (a, b) =>
                b.title.localeCompare(a.title, "hi")
        );

    } else if (sortVal === "lastdate") {

        sortedJobs.sort(
            (a, b) =>
                new Date(a.lastdate).getTime() -
                new Date(b.lastdate).getTime()
        );

    } else if (sortVal === "oldest") {

        sortedJobs.sort(
            (a, b) => Number(a.id) - Number(b.id)
        );

    } else {

        sortedJobs.sort(
            (a, b) => Number(b.id) - Number(a.id)
        );

    }

    return sortedJobs;
}
    
// ======================================
// 18. RESULTS UI
// ======================================
 
 
 function updateResultsUI() {

    if (!jobList) return;

    const jobs = AppState.filteredJobs || [];

    if (jobs.length === 0) {

        if (emptyState) {
            emptyState.classList.remove("hidden");
        }

        if (jobCount) {
            jobCount.textContent = "0";
        }

        if (paginationContainer) {
            paginationContainer.classList.add("hidden");
        }

        jobList.innerHTML = "";

    } else {

        if (emptyState) {
            emptyState.classList.add("hidden");
        }

        if (jobCount) {
            jobCount.textContent = jobs.length;
        }

        displayPaginatedJobs();
    }
}  
    
  
    

  // ======================================
// E2-2A-5A — DOM → CENTRAL STATE
// ======================================

function updateAppStateFromFilters() {



    // ----------------------------------
    // Hero Filters → AppState
    // ----------------------------------
    AppState.filters.heroCategory =
        heroCategory?.value || "";

    AppState.filters.heroState =
        heroState?.value || "";


    // ----------------------------------
    // Desktop Filters → AppState
    // ----------------------------------
    AppState.filters.category =
        filterCategory?.value || "";

    AppState.filters.department =
        filterDepartment?.value || "";

    AppState.filters.qualification =
        filterQualification?.value || "";

    AppState.filters.state =
        filterState?.value || "";

    AppState.filters.jobType =
        filterJobType?.value || "";

    AppState.filters.salary =
        filterSalary?.value || "";

    AppState.filters.lastDate =
        filterLastDate?.value || "";


    // ----------------------------------
    // Sort → AppState
    // ----------------------------------
    AppState.sortBy =
        sortJobs?.value || "latest";


    // ----------------------------------
    // Save Central State
    // ----------------------------------
    saveAppState();
}    
   // ======================================
// E2-2A — CENTRAL STATE FILTER PIPELINE
// ======================================

function applySearchFilters() {

    updateFilterCount();


    // ----------------------------------
    // 3. Build Filter Object
    //    From Central State ONLY
    // ----------------------------------
    const filters = {

        heroCatVal:
            AppState.filters.heroCategory,

        heroStateVal:
            AppState.filters.heroState,

        catVal:
            AppState.filters.category,

        deptVal:
            AppState.filters.department,

        qualVal:
            AppState.filters.qualification,

        stateVal:
            AppState.filters.state,

        typeVal:
            AppState.filters.jobType,

        salVal:
            AppState.filters.salary,

        dateVal:
            AppState.filters.lastDate
    };


    // ----------------------------------
    // 4. Filter Jobs
    // ----------------------------------
    AppState.filteredJobs =
    filterJobs(
        allJobs,
        AppState.searchKeyword,
        filters
    );

    


    // ----------------------------------
    // 5. Sorting
    // ----------------------------------

    AppState.filteredJobs =
    sortJobsList(
        AppState.filteredJobs,
        AppState.sortBy
    );




    // ----------------------------------
    // 6. Update Results UI
    // ----------------------------------
    updateResultsUI();

}
    
    
  
  
   
     
// ======================================
// 20. RESET SIDEBAR FILTERS
// Production-Level Reset System
// ======================================

function resetAllFilters(mode = "all") {

    // ----------------------------------
    // 1. Reset Sidebar Filters → AppState
    // ----------------------------------
    AppState.filters.heroCategory = "";
    AppState.filters.heroState = "";
  
    AppState.filters.category = "";
    AppState.filters.department = "";
    AppState.filters.qualification = "";
    AppState.filters.state = "";
    AppState.filters.jobType = "";
    AppState.filters.salary = "";
    AppState.filters.lastDate = "";

   // Reset Search & Sort
    AppState.searchKeyword = "";
    AppState.sortBy = "latest";

  
  
    // ----------------------------------
    // 2. Reset Current Page
    // ----------------------------------

    AppState.currentPage = 1;


    // ----------------------------------
    // 3. Save Central State
    // ----------------------------------

    saveAppState();


    // ----------------------------------
    // 4. AppState → DOM
    // ----------------------------------

    syncStateToInputs();


    // ----------------------------------
    // 5. Central Filter Pipeline
    // ----------------------------------

    applySearchFilters();


    // ----------------------------------
    // 6. Close Mobile Drawer
    // ----------------------------------

    if (mode === "mobile") {

        if (typeof hideFilterDrawer === "function") {
            hideFilterDrawer();
        }

    }

}
     
     
     
// ======================================
// 21. PAGINATION ENGINE
// ======================================
    
function getPaginatedItems(items, page, perPage) {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
}  
     
    
  
function displayPaginatedJobs() {
    if (!jobList) return;

    const jobs = AppState.filteredJobs || [];

    const totalPages = Math.max(
        1,
        Math.ceil(jobs.length / CARDS_PER_PAGE)
    );

    if (AppState.currentPage < 1) {
        AppState.currentPage = 1;
    }

    if (AppState.currentPage > totalPages) {
        AppState.currentPage = totalPages;
    }

    jobList.innerHTML = "";

    const paginatedItems = getPaginatedItems(
        jobs,
        AppState.currentPage,
        CARDS_PER_PAGE
    );

    paginatedItems.forEach(job => {
    const cardElement = renderJobCard(job);
    jobList.appendChild(cardElement);
});

// 🔖 Bookmark Buttons
setupBookmarkButtons();
updateBookmarkIcons();

// 📤 Share Buttons
setupShareButtons();

// Pagination Update
renderPagination(jobs.length);

}
     
     
function renderPagination(totalItems) {
    

    const totalPages = Math.max(
    1,
    Math.ceil(totalItems / CARDS_PER_PAGE)
);

    if (totalPages <= 1) {
        if(paginationContainer) paginationContainer.classList.add("hidden");
        return;
    } else {
        if(paginationContainer) paginationContainer.classList.remove("hidden");
    }

    if(prevPageBtn) prevPageBtn.disabled = (AppState.currentPage === 1);
    if (nextPageBtn) {
    nextPageBtn.disabled =
        (AppState.currentPage >= totalPages);
}

    if(pageNumbersContainer) {
        pageNumbersContainer.innerHTML = "";
        
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.className = `h-10 w-10 rounded-xl border text-sm font-medium transition ${
                i === AppState.currentPage
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`;
            
            pageBtn.addEventListener("click", () => {
                AppState.currentPage = i;
              saveAppState();
                displayPaginatedJobs();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            pageNumbersContainer.appendChild(pageBtn);
        }
    }
}
  
  
function goToPreviousPage() {
    if (AppState.currentPage <= 1) return;

    AppState.currentPage--;
saveAppState();
    displayPaginatedJobs();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
  
function goToNextPage() {
    const totalPages = Math.max(
        1,
        Math.ceil(
            (AppState.filteredJobs || []).length /
            CARDS_PER_PAGE
        )
    );

    if (AppState.currentPage >= totalPages) return;

    AppState.currentPage++;
    saveAppState();
    displayPaginatedJobs();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
} 
  
  
  
    //8. 🔖 Bookmark
function loadBookmarks() {
    const savedBookmarks = localStorage.getItem("bookmarks"); // bookmarks.html से मैच की गई की
    if (savedBookmarks) {
        try {
            bookmarkedJobs = JSON.parse(savedBookmarks);
        } catch (error) {
            bookmarkedJobs = [];
            console.error("Bookmark Load Error", error);
        }
    } else {
        bookmarkedJobs = [];
    }
}
function toggleBookmark(jobId) {
    const index = bookmarkedJobs.indexOf(jobId);
    if (index === -1) {
        bookmarkedJobs.push(jobId);
    } else {
        bookmarkedJobs.splice(index, 1);
    }

    // Save to Shared LocalStorage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkedJobs));

    // UI Updates
    updateBookmarkIcons();
}
  
  
function updateBookmarkIcons() {
    const bookmarkButtons = document.querySelectorAll(".bookmarkBtn");

    bookmarkButtons.forEach((button) => {
        const jobId = button.dataset.jobId;
        if (!jobId) return;

        const icon = button.querySelector("i");
        if (!icon) return;

        if (bookmarkedJobs.includes(jobId)) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            button.classList.add("text-yellow-500");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
            button.classList.remove("text-yellow-500");
        }
    });
}
function setupBookmarkButtons() {
    const bookmarkButtons = document.querySelectorAll(".bookmarkBtn");

    bookmarkButtons.forEach((button) => {
        if (button.dataset.bookmarkReady === "true") {
            return;
        }

        button.dataset.bookmarkReady = "true";

        button.addEventListener("click", () => {
            const jobId = button.dataset.jobId;
            if (!jobId) return;

            toggleBookmark(jobId);
        });
    });
}
  
  
  
    
  
    
  
  
  //9. 📤 Share
function setupShareButtons() {

    const shareButtons =
        document.querySelectorAll(".shareBtn");

    shareButtons.forEach((button) => {

        if (button.dataset.shareReady === "true") {
            return;
        }

        button.dataset.shareReady = "true";

        button.addEventListener("click", () => {

            const jobId = button.dataset.jobId;
            if (!jobId) return;

            currentShareData = generateShareData(jobId);
          if (!currentShareData) return;

          
          
          if (navigator.share) {

    navigator.share({
        title: currentShareData.title,
        text: currentShareData.shareText,
        url: currentShareData.jobUrl
    }).catch((error) => {

        if (error.name === "AbortError") {
            return;
        }

        console.warn(
            "Native Share Failed:",
            error
        );

    });

    return;

} else {

    if (shareMenu) {
        shareMenu.classList.remove("hidden");
    }

}

        });

    });

}
 
     
     
function generateShareData(jobId) {

    const job = allJobs.find(item => String(item.id) === String(jobId));

    if (!job) return null;

    const jobUrl =
        `${window.location.origin}/job-details.html?id=${job.id}`;

    const shareText =
`📢 ${job.title}

🏢 Department: ${job.department}
🎓 Qualification: ${job.qualification}
📅 Last Date: ${job.lastdate}

🔗 Apply Now:
${jobUrl}`;

    return {
        id: job.id,
        title: job.title,
        department: job.department,
        qualification: job.qualification,
        lastdate: job.lastdate,
        shareText,
        jobUrl
    };
}
   
    
  
    
  
    
    
    
// ======================================
// THEME EVENTS
// ======================================

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        if (html.classList.contains("dark")) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });
}

// loadTheme();
    
// ======================================
// MOBILE MENU EVENTS
// ======================================

if (menuBtn) {
    menuBtn.addEventListener("click", openMenu);
}

if (closeMenu) {
    closeMenu.addEventListener("click", closeMobileMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener("click", closeMobileMenu);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
        closeMobileMenu();
    }
});
    
    
    // Global Event Triggers Sync

  
  
  
    
    
    // ======================================
// HEADER + HERO SEARCH EVENTS
// ======================================

// --------------------------------------
// Hero / Main Search Input
// --------------------------------------
if (jobSearch) {

    jobSearch.addEventListener("input", () => {

        handleSearchInput("job");

    });

}


// --------------------------------------
// Header Search Input
// --------------------------------------
if (headerSearch) {

    headerSearch.addEventListener("input", () => {

        handleSearchInput("header");

    });

}


// --------------------------------------
// Header Search — Enter
// --------------------------------------
if (headerSearch) {

    headerSearch.addEventListener("keydown", (e) => {

        if (e.key !== "Enter") return;

        e.preventDefault();

        applySearchFilters();

    });

}


// --------------------------------------
// Header Search Button
// --------------------------------------
if (headerSearchBtn) {

    headerSearchBtn.addEventListener("click", (e) => {

        if (isMobileSearch()) {

            // Prevent document-level
            // outside-click handler
            e.stopPropagation();

            openHeaderSearch();

            return;
        }

        // Desktop
        if (headerSearch) {
            headerSearch.focus();
        }

        applySearchFilters();

    });

}


// --------------------------------------
// Header Search — X Button
// --------------------------------------
if (headerSearchClose) {

    headerSearchClose.addEventListener("click", (e) => {

        e.stopPropagation();

        hideHeaderSearchUI();

        clearSearch();

    });

}


// --------------------------------------
// Header Search — ESC
// UI Hide ONLY
// --------------------------------------
document.addEventListener("keydown", (e) => {

    if (e.key !== "Escape") return;

    if (!isMobileSearch()) return;

    if (
        headerSearchWrapper &&
        !headerSearchWrapper.classList.contains("hidden")
    ) {

        hideHeaderSearchUI();

    }

});


// --------------------------------------
// Header Search — Outside Click
// UI Hide ONLY
// --------------------------------------
document.addEventListener("click", (e) => {

    if (!isMobileSearch()) return;

    if (
        !headerSearchWrapper ||
        headerSearchWrapper.classList.contains("hidden")
    ) {
        return;
    }

    const insideSearch =
        headerSearchWrapper.contains(e.target);

    const clickButton =
        headerSearchBtn &&
        headerSearchBtn.contains(e.target);

    // Search UI या Search Button के अंदर
    // click हुआ तो outside click नहीं है.
    if (insideSearch || clickButton) {
        return;
    }

    // Outside Click
    // केवल UI hide होगा.
    hideHeaderSearchUI();

});
    
    
    
    
    
    
    
    
    
    
    
   
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
    
    
     
// ======================================
// HEADER SEARCH — RESIZE SAFETY
// ======================================

let lastViewportWidth = window.innerWidth;

window.addEventListener("resize", () => {

    const currentWidth = window.innerWidth;

    // Width नहीं बदली:
    // mobile keyboard / height-only resize
    // को ignore करो.
    if (currentWidth === lastViewportWidth) {
        return;
    }

    lastViewportWidth = currentWidth;

    // ----------------------------------
    // Desktop
    // ----------------------------------
    if (currentWidth >= 768) {

        if (headerSearchWrapper) {
            headerSearchWrapper.classList.remove("hidden");
            headerSearchWrapper.classList.add("md:flex");
        }

        if (headerSearchBtn) {
            headerSearchBtn.classList.remove("hidden");
        }

        if (headerSearchClose) {
            headerSearchClose.classList.add("hidden");
        }

        return;
    }

    // ----------------------------------
    // Mobile
    // ----------------------------------
    if (headerSearchWrapper) {
        headerSearchWrapper.classList.add("hidden");
        headerSearchWrapper.classList.remove("md:flex");
    }

    if (headerSearchBtn) {
        headerSearchBtn.classList.remove("hidden");
    }

    if (headerSearchClose) {
        headerSearchClose.classList.add("hidden");
    }

}); 
       
       
 
       
       
       
       
       
// ======================================
// INITIAL HEADER SEARCH UI
// ======================================

if (isMobileSearch()) {

    if (headerSearchWrapper) {
        headerSearchWrapper.classList.add("hidden");
    }

    if (headerSearchClose) {
        headerSearchClose.classList.add("hidden");
    }

} else {

    if (headerSearchWrapper) {
        headerSearchWrapper.classList.remove("hidden");
        headerSearchWrapper.classList.add("md:block");
    }

}
       
       
       
    
    // ======================================
// DESKTOP APPLY FILTERS
// ======================================

if (applyFilters) {

    applyFilters.addEventListener("click", (e) => {

        e.preventDefault();

        // Desktop → Mobile
        syncFilterInputs("desktop");

        // Desktop → Central AppState
        updateAppStateFromFilters();

        // Central State → Filter Engine
        applySearchFilters();

    });

}


     
if (resetFilters) {
    resetFilters.addEventListener("click", () => {
        resetAllFilters("desktop");
    });
}
     
// ======================================
// MOBILE APPLY FILTERS
// ======================================

if (mobileApplyFilters) {

    mobileApplyFilters.addEventListener("click", (e) => {

        e.preventDefault();

        // Mobile → Desktop
        syncFilterInputs("mobile");

        // Desktop → Central AppState
        updateAppStateFromFilters();

        // Apply
        applySearchFilters();

        // Close drawer
        hideFilterDrawer();

    });

}
     
     
if (prevPageBtn) {
    prevPageBtn.addEventListener("click", goToPreviousPage);
}
if (nextPageBtn) {
    nextPageBtn.addEventListener("click", goToNextPage);
}
  
     
     
     
     
     
     
     
     
    
     if (mobileResetFilters) {
    mobileResetFilters.addEventListener("click", () => {
        resetAllFilters("mobile");
    });
}
     
if (emptyResetBtn) {
    emptyResetBtn.addEventListener("click", () => {
        resetAllFilters("all");
    });
}
  
     
     
     
     
     
     
     if (sortJobs) {
    sortJobs.addEventListener("change", () => {

        // DOM → AppState
        AppState.sortBy =
            sortJobs.value || "latest";

        // Reset pagination
        AppState.currentPage = 1;

        // Save Central State
        saveAppState();

        // Apply Central State
        applySearchFilters();
    });
}
     
     
     
     // ======================================
// HERO SEARCH BUTTON
// ======================================
if (heroSearchBtn) {

    heroSearchBtn.addEventListener("click", (e) => {

        e.preventDefault();

        // ----------------------------------
        // Hero Filters → AppState
        // ----------------------------------
        AppState.filters.heroCategory =
            heroCategory?.value || "";

        AppState.filters.heroState =
            heroState?.value || "";

        // ----------------------------------
        // Search Action → First Page
        // ----------------------------------
        AppState.currentPage = 1;

        // ----------------------------------
        // Persist Central State
        // ----------------------------------
        saveAppState();

        // ----------------------------------
        // AppState → DOM
        // ----------------------------------
        syncStateToInputs();

        // ----------------------------------
        // Central Search Pipeline
        // ----------------------------------
        applySearchFilters();

    });

}
     
     
     
     
     
     
if (shareWhatsapp) {

    shareWhatsapp.addEventListener("click", () => {

        if (!currentShareData) return;

        const whatsappUrl =
            "https://wa.me/?text=" +
            encodeURIComponent(
                currentShareData.shareText
            );

        window.open(
            whatsappUrl,
            "_blank"
        );

    });

}
     
if (shareTelegram) {

    shareTelegram.addEventListener("click", () => {

        if (!currentShareData) return;

        const telegramUrl =
            "https://t.me/share/url?url=" +
            encodeURIComponent(
                currentShareData.jobUrl
            ) +
            "&text=" +
            encodeURIComponent(
                currentShareData.shareText
            );

        window.open(
            telegramUrl,
            "_blank"
        );

    });

}
if (shareTwitter) {

    shareTwitter.addEventListener("click", () => {

        if (!currentShareData) return;

        const twitterUrl =
            "https://x.com/intent/post?text=" +
            encodeURIComponent(
                currentShareData.shareText
            ) +
            "&url=" +
            encodeURIComponent(
                currentShareData.jobUrl
            );

        window.open(
            twitterUrl,
            "_blank"
        );

    });

}
if (shareCopy) {

    shareCopy.addEventListener("click", async () => {

        if (!currentShareData) return;

        const jobUrl = currentShareData.jobUrl;

        if (navigator.clipboard) {

            try {

                await navigator.clipboard.writeText(
                    jobUrl
                );

                alert("✅ Link Copied!");

            } catch (error) {

                console.warn(
                    "Copy Failed:",
                    error
                );

                prompt(
                    "Copy this Link:",
                    jobUrl
                );

            }

        } else {

            prompt(
                "Copy this Link:",
                jobUrl
            );

        }

    });

} 
if (shareMenuClose) {

    shareMenuClose.addEventListener("click", () => {

        shareMenu.classList.add("hidden");

    });

}
if (shareMenuOverlay) {

    shareMenuOverlay.addEventListener("click", () => {

        shareMenu.classList.add("hidden");

    });

}
document.addEventListener("click", (event) => {

    if (
        shareMenu &&
        !shareMenu.classList.contains("hidden") &&
        !shareMenu.contains(event.target) &&
        !event.target.closest(".shareBtn")
    ) {

        shareMenu.classList.add("hidden");

    }

});
window.addEventListener("scroll", () => {
    if (scrollProgress) {
    const totalHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        totalHeight > 0
            ? (window.scrollY / totalHeight) * 100
            : 0;

    scrollProgress.style.width = progress + "%";
}
});

     
     
    
    // ======================================
// FILTER DRAWER EVENTS
// ======================================

if (openFilterDrawer) {
    openFilterDrawer.addEventListener(
        "click",
        showFilterDrawer
    );
}

if (closeFilterDrawer) {
    closeFilterDrawer.addEventListener(
        "click",
        hideFilterDrawer
    );
}

if (filterOverlay) {
    filterOverlay.addEventListener(
        "click",
        hideFilterDrawer
    );
}

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        hideFilterDrawer();
    }

});

window.addEventListener("resize", () => {

    if (window.innerWidth >= 1024) {
        hideFilterDrawer();
    }

});
    
    
     
     
     
     
    
  
      
      
    
