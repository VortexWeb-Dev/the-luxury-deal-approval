<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Referral Module - VortexWeb</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body class="bg-gray-100 font-sans antialiased">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-64 bg-gray-900 text-white flex flex-col justify-between">
            <div>
                <div class="p-4 text-2xl font-bold border-b border-gray-800 text-center">
                    VortexWeb
                </div>
                <nav class="mt-4">
                    <a href="" class="block py-2.5 px-4 text-sm hover:bg-gray-800 flex items-center" onclick="showSection('all-deals')">
                        <i class="fas fa-list mr-2"></i> All Deals
                    </a>
                    <a href="" class="block py-2.5 px-4 text-sm hover:bg-gray-800 flex items-center" onclick="showSection('approved-deals')">
                        <i class="fas fa-check-circle mr-2"></i> Approved Deals
                    </a>
                    <a href="" class="block py-2.5 px-4 text-sm hover:bg-gray-800 flex items-center" onclick="showSection('rejected-deals')">
                        <i class="fas fa-times-circle mr-2"></i> Rejected Deals
                    </a>
                    <a href="" class="block py-2.5 px-4 text-sm hover:bg-gray-800 flex items-center" onclick="showSection('pending-deals')">
                        <i class="fas fa-minus-circle mr-2"></i> Pending Deals
                    </a>
                </nav>
            </div>
            <div class="p-4 text-xs text-gray-500 text-center">
                Powered by <a href="https://vortexweb.cloud" target="_blank" class="hover:underline">VortexWeb</a> © <?= date('Y') ?>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 p-6 overflow-auto">
            <!-- Stats -->
            <div id="stats" class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <p class="text-sm text-gray-500">Total Deals</p>
                    <p class="text-2xl font-semibold" id="total-deals">0</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <p class="text-sm text-gray-500">Total Amount</p>
                    <p class="text-2xl font-semibold" id="total-amount">$0</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <p class="text-sm text-gray-500">Total Referral Amount</p>
                    <p class="text-2xl font-semibold" id="total-referral">$0</p>
                </div>
            </div>

            <!-- Sections -->
            <div id="all-deals" class="section">
                <h2 class="text-xl font-semibold mb-4">All Deals</h2>
                <div id="all-deals-table" class="bg-white rounded-lg shadow-sm overflow-hidden"></div>
                <div id="all-deals-pagination" class="mt-4 flex justify-between items-center"></div>
            </div>

            <div id="approved-deals" class="section hidden">
                <h2 class="text-xl font-semibold mb-4">Approved Deals</h2>
                <div id="approved-deals-table" class="bg-white rounded-lg shadow-sm overflow-hidden"></div>
                <div id="approved-deals-pagination" class="mt-4 flex justify-between items-center"></div>
            </div>

            <div id="rejected-deals" class="section hidden">
                <h2 class="text-xl font-semibold mb-4">Rejected Deals</h2>
                <div id="rejected-deals-table" class="bg-white rounded-lg shadow-sm overflow-hidden"></div>
                <div id="rejected-deals-pagination" class="mt-4 flex justify-between items-center"></div>
            </div>

            <div id="pending-deals" class="section hidden">
                <h2 class="text-xl font-semibold mb-4">Pending Deals</h2>
                <div id="pending-deals-table" class="bg-white rounded-lg shadow-sm overflow-hidden"></div>
                <div id="pending-deals-pagination" class="mt-4 flex justify-between items-center"></div>
            </div>

        </div>
    </div>

    <script src="script.js"></script>
</body>

</html>