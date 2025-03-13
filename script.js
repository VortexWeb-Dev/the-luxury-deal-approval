// Sample data (replace with actual backend API calls)
const deals = [
  { id: 1, name: "Deal 1", amount: 1000, referral: 100, status: "pending" },
  { id: 2, name: "Deal 2", amount: 2000, referral: 200, status: "approved" },
  { id: 3, name: "Deal 3", amount: 1500, referral: 150, status: "rejected" },
  { id: 4, name: "Deal 4", amount: 3000, referral: 300, status: "pending" },
  { id: 5, name: "Deal 5", amount: 2500, referral: 250, status: "approved" },
  { id: 6, name: "Deal 6", amount: 1800, referral: 180, status: "pending" },
  { id: 7, name: "Deal 7", amount: 2200, referral: 220, status: "approved" },
  { id: 8, name: "Deal 8", amount: 1600, referral: 160, status: "rejected" },
  { id: 9, name: "Deal 9", amount: 1900, referral: 190, status: "pending" },
  { id: 10, name: "Deal 10", amount: 1000, referral: 100, status: "pending" },
  { id: 11, name: "Deal 11", amount: 2000, referral: 200, status: "approved" },
  { id: 12, name: "Deal 12", amount: 1500, referral: 150, status: "rejected" },
  { id: 13, name: "Deal 13", amount: 3000, referral: 300, status: "pending" },
  { id: 14, name: "Deal 14", amount: 2500, referral: 250, status: "approved" },
  { id: 15, name: "Deal 15", amount: 1800, referral: 180, status: "pending" },
  { id: 16, name: "Deal 16", amount: 2200, referral: 220, status: "approved" },
  { id: 17, name: "Deal 17", amount: 1600, referral: 160, status: "rejected" },
  { id: 18, name: "Deal 18", amount: 1900, referral: 190, status: "pending" },
  { id: 19, name: "Deal 19", amount: 1000, referral: 100, status: "pending" },
  { id: 20, name: "Deal 20", amount: 2000, referral: 200, status: "approved" },
];

const ITEMS_PER_PAGE = 10;

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden");
  });
  document.getElementById(sectionId).classList.remove("hidden");
  renderSection(sectionId);
}

function renderStats() {
  const totalDeals = deals.length;
  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const totalReferral = deals.reduce((sum, deal) => sum + deal.referral, 0);

  document.getElementById("total-deals").textContent = totalDeals;
  document.getElementById(
    "total-amount"
  ).textContent = `$${totalAmount.toLocaleString()}`;
  document.getElementById(
    "total-referral"
  ).textContent = `$${totalReferral.toLocaleString()}`;
}

function renderTable(containerId, data, page = 1) {
  const container = document.getElementById(containerId);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedData = data.slice(start, end);

  let html = `
        <table class="w-full text-left">
            <thead class="bg-gray-50">
                <tr>
                    <th class="p-3 text-sm font-medium text-gray-500">ID</th>
                    <th class="p-3 text-sm font-medium text-gray-500">Name</th>
                    <th class="p-3 text-sm font-medium text-gray-500">Amount</th>
                    <th class="p-3 text-sm font-medium text-gray-500">Referral</th>
                    <th class="p-3 text-sm font-medium text-gray-500">Status</th>
                    <th class="p-3 text-sm font-medium text-gray-500">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
    `;

  paginatedData.forEach((deal) => {
    html += `
            <tr>
                <td class="p-3 text-sm text-gray-900">${deal.id}</td>
                <td class="p-3 text-sm text-gray-900">${deal.name}</td>
                <td class="p-3 text-sm text-gray-900">$${deal.amount.toLocaleString()}</td>
                <td class="p-3 text-sm text-gray-900">$${deal.referral.toLocaleString()}</td>
                <td class="p-3 text-sm capitalize ${
                  deal.status === "approved"
                    ? "text-green-600"
                    : deal.status === "rejected"
                    ? "text-red-600"
                    : "text-gray-600"
                }">${deal.status}</td>
                <td class="p-3">
                    ${
                      deal.status === "pending"
                        ? `
                                <button onclick="updateStatus(${deal.id}, 'approved')" title="Approve" class="text-green-600 hover:text-green-800 mr-2">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button onclick="updateStatus(${deal.id}, 'rejected')" title="Reject" class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-times"></i>
                                </button>
                            `
                        : deal.status === "approved"
                        ? `
                                <button onclick="updateStatus(${deal.id}, 'rejected')" title="Reject" class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-times"></i>
                                </button>
                            `
                        : `
                                <button onclick="updateStatus(${deal.id}, 'approved')" title="Approve" class="text-green-600 hover:text-green-800 mr-2">
                                    <i class="fas fa-check"></i>
                                </button>
                            `
                    }
                </td>
            </tr>
        `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;

  renderPagination(
    containerId.replace("-table", "-pagination"),
    data.length,
    page
  );
}

function renderPagination(containerId, totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const container = document.getElementById(containerId);

  let html = `
        <div class="text-sm text-gray-500">
            Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1} to ${Math.min(
    currentPage * ITEMS_PER_PAGE,
    totalItems
  )} of ${totalItems} deals
        </div>
        <div class="flex space-x-2">
    `;

  if (currentPage > 1) {
    html += `<button onclick="renderSection('${
      containerId.split("-")[0] + "-deals"
    }', ${
      currentPage - 1
    })" class="px-3 py-1 bg-white rounded-lg shadow-sm hover:bg-gray-50"><i class="fas fa-chevron-left"></i></button>`;
  }

  html += `<span class="px-3 py-1 bg-white rounded-lg shadow-sm">${currentPage} / ${totalPages}</span>`;

  if (currentPage < totalPages) {
    html += `<button onclick="renderSection('${
      containerId.split("-")[0] + "-deals"
    }', ${
      currentPage + 1
    })" class="px-3 py-1 bg-white rounded-lg shadow-sm hover:bg-gray-50"><i class="fas fa-chevron-right"></i></button>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

function updateStatus(dealId, newStatus) {
  const deal = deals.find((d) => d.id === dealId);
  if (deal) {
    deal.status = newStatus;
    renderSection(document.querySelector(".section:not(.hidden)").id);
    renderStats();
  }
}

function renderSection(sectionId, page = 1) {
  let data;
  if (sectionId === "all-deals") data = deals;
  else if (sectionId === "approved-deals")
    data = deals.filter((d) => d.status === "approved");
  else if (sectionId === "rejected-deals")
    data = deals.filter((d) => d.status === "rejected");

  renderTable(`${sectionId}-table`, data, page);
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  showSection("all-deals");
});
