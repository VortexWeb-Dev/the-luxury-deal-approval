const API_BASE_URL =
  "https://vortexwebclouds.bitrix24.in/rest/201/l50jvwht5fnug2xg";

const DIRECTORS_APPROVAL_STAGE_ID = "C27:PREPAYMENT_INVOIC";
const TRANSFER_IN_PROGRESS_STAGE_ID = "C27:EXECUTING";
const ITEMS_PER_PAGE = 10;

let renderSection;
let updateStatus;
let showSection;

function getStatusFromStage(stageId) {
  const stageMapping = {
    "C27:PREPAYMENT_INVOIC": "Rejected",
    "C27:EXECUTING": "Approved",
  };
  return stageMapping[stageId] || "unknown";
}

async function fetchData() {
  try {
    const params = new URLSearchParams();

    params.append("filter[=STAGE_ID][0]", DIRECTORS_APPROVAL_STAGE_ID);
    params.append("filter[=STAGE_ID][1]", TRANSFER_IN_PROGRESS_STAGE_ID);

    params.append("select[0]", "ID");
    params.append("select[1]", "TITLE");
    params.append("select[2]", "OPPORTUNITY");
    params.append("select[3]", "UF_CRM_1742018841006");
    params.append("select[4]", "STAGE_ID");

    const response = await fetch(
      `${API_BASE_URL}/crm.deal.list?${params.toString()}`
    );
    const data = await response.json();

    if (data.result) {
      return data.result;
    } else {
      console.error("Error fetching deals:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const deals = await fetchData();
  console.log(deals);

  async function renderStats() {
    const deals = await fetchData();
    const totalDeals = deals.length;
    const totalAmount = deals.reduce(
      (sum, deal) => sum + (parseFloat(deal.OPPORTUNITY) || 0),
      0
    );
    const totalReferral = deals.reduce(
      (sum, deal) => sum + (parseFloat(deal.UF_CRM_1742018841006) || 0),
      0
    );

    document.getElementById("total-deals").textContent = totalDeals;
    document.getElementById("total-amount").textContent = `$${
      totalAmount ? totalAmount.toLocaleString() : 0
    }`;
    document.getElementById("total-referral").textContent = `$${
      totalReferral ? totalReferral.toLocaleString() : 0
    }`;
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
                      <th class="p-3 text-sm font-medium text-gray-500">Referral Amount</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Status</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Action</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
      `;

    paginatedData.forEach((deal) => {
      html += `
              <tr>
                  <td class="p-3 text-sm text-gray-900">${deal.ID}</td>
                  <td class="p-3 text-sm text-gray-900">${deal.TITLE}</td>
                  <td class="p-3 text-sm text-gray-900">$${
                    deal.OPPORTUNITY
                      ? parseFloat(deal.OPPORTUNITY).toLocaleString()
                      : 0
                  }</td>
                  <td class="p-3 text-sm text-gray-900">$${
                    deal.UF_CRM_1742018841006
                      ? parseFloat(deal.UF_CRM_1742018841006).toLocaleString()
                      : 0
                  }</td>
                  <td class="p-3 text-sm capitalize ${
                    deal.STAGE_ID === TRANSFER_IN_PROGRESS_STAGE_ID
                      ? "text-green-600"
                      : deal.STAGE_ID === DIRECTORS_APPROVAL_STAGE_ID
                      ? "text-red-600"
                      : "text-gray-600"
                  }">${getStatusFromStage(deal.STAGE_ID)}</td>
                  <td class="p-3">
                      ${
                        deal.STAGE_ID === TRANSFER_IN_PROGRESS_STAGE_ID
                          ? `
                                  <button onclick="updateStatus(${deal.ID}, 'rejected')" title="Reject" class="text-red-600 hover:text-red-800">
                                      <i class="fas fa-times"></i>
                                  </button>
                              `
                          : `
                                  <button onclick="updateStatus(${deal.ID}, 'approved')" title="Approve" class="text-green-600 hover:text-green-800 mr-2">
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
              Showing ${
                Math.min(totalItems, 1) > 0
                  ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                  : 0
              } to ${Math.min(
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

  renderSection = async function (sectionId, page = 1) {
    let data = await fetchData();

    if (sectionId === "all-deals") {
    } else if (sectionId === "approved-deals") {
      data = data.filter((d) => d.STAGE_ID === TRANSFER_IN_PROGRESS_STAGE_ID);
    } else if (sectionId === "rejected-deals") {
      data = data.filter((d) => d.STAGE_ID === DIRECTORS_APPROVAL_STAGE_ID);
    }

    renderTable(`${sectionId}-table`, data, page);
  };

  updateStatus = async function (dealId, newStatus) {
    let newStageId;
    let rejectionReason = "";
  
    if (newStatus === "approved") {
      newStageId = TRANSFER_IN_PROGRESS_STAGE_ID;
    } else if (newStatus === "rejected") {
      newStageId = DIRECTORS_APPROVAL_STAGE_ID;
  
      rejectionReason = prompt("Please enter the reason for rejection:");
      
      if (!rejectionReason) {
        return;
      }
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/crm.deal.update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: dealId,
          fields: {
            STAGE_ID: newStageId,
            ...(newStatus === "rejected" && {
              UF_CRM_1742029952767: rejectionReason, 
            }),
          },
        }),
      });
  
      const data = await response.json();
  
      if (data.result) {
        renderSection(document.querySelector(".section:not(.hidden)").id);
        renderStats();
      } else {
        console.error("Error updating deal:", data);
      }
    } catch (error) {
      console.error("Failed to update deal:", error);
    }
  };
  

  showSection = async function (sectionId) {
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
    renderSection(sectionId);
  };

  renderStats();
  showSection("all-deals");

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");
      if (sectionId) {
        showSection(sectionId);
      }
    });
  });
});
