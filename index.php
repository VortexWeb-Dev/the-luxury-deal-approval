<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Referral Module - The Luxury</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body class="bg-gray-100 font-sans antialiased">
    <div class="flex flex-col h-screen">
        <!-- Mobile Header with Toggle Button -->
        <div class="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
            <div class="text-2xl font-bold">The Luxury</div>
            <button id="sidebar-toggle" class="text-white focus:outline-none">
                <i class="fas fa-bars"></i>
            </button>
        </div>

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar (hidden by default on mobile) -->
            <div id="sidebar" class="fixed md:relative w-64 bg-gray-900 text-white h-full transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out z-20">
                <div class="hidden md:block p-4 text-2xl font-bold border-b border-gray-800 text-center">
                    The Luxury
                </div>
                <nav class="mt-4">
                    <a href="#" class="block py-2.5 px-4 text-sm hover:bg-gray-800 flex items-center" onclick="showSection('all-deals'); closeSidebarOnMobile();">
                        <i class="fas fa-list mr-2"></i> All Deals
                    </a>
                    <a href="#" class="block py-2.5 px-4 text-sm hover:bg-gray-800 flex items-center" onclick="showSection('approved-deals'); closeSidebarOnMobile();">
                        <i class="fas fa-check-circle mr-2"></i> Approved Deals
                    </a>
                    <a href="#" class="block py-2.5 px-4 text-sm hover:bg-gray-800 flex items-center" onclick="showSection('rejected-deals'); closeSidebarOnMobile();">
                        <i class="fas fa-times-circle mr-2"></i> Rejected Deals
                    </a>
                    <a href="#" class="block py-2.5 px-4 text-sm hover:bg-gray-800 flex items-center" onclick="showSection('pending-deals'); closeSidebarOnMobile();">
                        <i class="fas fa-minus-circle mr-2"></i> Pending Deals
                    </a>
                </nav>
                <div class="absolute bottom-0 left-0 right-0 p-4 text-xs text-gray-500 text-center">
                    Powered by <a href="https://vortexweb.cloud" target="_blank" class="hover:underline">VortexWeb</a> © <span id="current-year"></span>
                </div>
            </div>

            <!-- Overlay to close sidebar when clicking outside -->
            <div id="sidebar-overlay" class="fixed inset-0 bg-black opacity-50 z-10 hidden md:hidden" onclick="toggleSidebar()"></div>

            <!-- Main Content -->
            <div class="flex-1 p-4 md:p-6 overflow-auto w-full">
                <!-- Stats -->
                <div id="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white p-4 rounded-lg shadow-md">
                        <p class="text-sm text-gray-500">Total Deals</p>
                        <p class="text-2xl font-semibold" id="total-deals">0</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-md">
                        <p class="text-sm text-gray-500">Total Commission Amount</p>
                        <p class="text-2xl font-semibold" id="total-commission-amount">AED 0</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-md">
                        <p class="text-sm text-gray-500">Total Sales Progression Fee</p>
                        <p class="text-2xl font-semibold" id="total-sales-progression-fee">AED 0</p>
                    </div>
                </div>

                <!-- Sections -->
                <div id="all-deals" class="section">
                    <h2 class="text-xl font-semibold mb-4">All Deals</h2>
                    <div id="all-deals-table" class="bg-white rounded-lg shadow-sm overflow-x-auto"></div>
                    <div id="all-deals-pagination" class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2"></div>
                </div>

                <div id="pending-deals" class="section hidden">
                    <h2 class="text-xl font-semibold mb-4">Pending Deals (Director Approval)</h2>
                    <div id="pending-deals-table" class="bg-white rounded-lg shadow-sm overflow-x-auto"></div>
                    <div id="pending-deals-pagination" class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2"></div>
                </div>

                <div id="rejected-deals" class="section hidden">
                    <h2 class="text-xl font-semibold mb-4">Rejected Deals (Sales Progression Ongoing)</h2>
                    <div id="rejected-deals-table" class="bg-white rounded-lg shadow-sm overflow-x-auto"></div>
                    <div id="rejected-deals-pagination" class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2"></div>
                </div>

                <div id="approved-deals" class="section hidden">
                    <h2 class="text-xl font-semibold mb-4">Approved Deals (Transfer in Progress)</h2>
                    <div id="approved-deals-table" class="bg-white rounded-lg shadow-sm overflow-x-auto"></div>
                    <div id="approved-deals-pagination" class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();

        // Sidebar toggle functionality
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            
            sidebar.classList.toggle('-translate-x-full');
            
            if (sidebar.classList.contains('-translate-x-full')) {
                overlay.classList.add('hidden');
            } else {
                overlay.classList.remove('hidden');
            }
        }

        // Close sidebar on mobile after clicking a menu item
        function closeSidebarOnMobile() {
            if (window.innerWidth < 768) { // md breakpoint is typically 768px
                toggleSidebar();
            }
        }

        // Initialize sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);

        // Add your existing script.js functionality here or keep the external reference
        // if it doesn't interfere with the new mobile functionality
    </script>
    <script src="./script.js"></script>
</body>

</html>