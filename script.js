const API_BASE_URL =
  "https://crm.theluxuryrealestate.ae/rest/121/pjkq2khjun2sr1q0";

const PENDING_STAGE_ID = "C1:UC_HJL9ZN";
const REJECTED_STAGE_ID = "C1:UC_L8K3S7";
const APPROVED_STAGE_ID = "C1:UC_LKP13Z";

const ITEMS_PER_PAGE = 20;

let renderSection;
let updateStatus;
let showSection;

(async () => {
  const API_URL = `${API_BASE_URL}/user.get`;
  const CACHE_KEY = "users";
  const CACHE_TIME_KEY = "users_cache_time";
  const CACHE_DURATION = 60 * 60 * 1000;

  const cachedData = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

  if (cachedData && cachedTime && Date.now() - cachedTime < CACHE_DURATION) {
    return;
  }

  let allUsers = [];
  let start = 0;
  let batchSize = 50;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${API_URL}?start=${start}&select[0]=ID&select[1]=NAME&select[2]=LAST_NAME&filter[ACTIVE]=Y`
    );
    const data = await response.json();

    if (data.result) {
      allUsers = allUsers.concat(data.result);
    }

    if (data.total && allUsers.length < data.total) {
      start += batchSize;
    } else {
      hasMore = false;
    }
  }

  localStorage.setItem(CACHE_KEY, JSON.stringify(allUsers));
  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
})();

function getUserId(userId) {
  const users = JSON.parse(localStorage.getItem("users"));
  if (users) {
    const user = users.find((u) => u.ID === userId);
    return user ? (user.NAME + " " + user.LAST_NAME).trim() : userId;
  }
  return userId;
}

function getStatusFromStage(stageId) {
  const stageMapping = {
    "C1:UC_HJL9ZN": "Pending",
    "C1:UC_L8K3S7": "Rejected",
    "C1:UC_LKP13Z": "Approved",
  };
  return stageMapping[stageId] || "Pending";
}

async function fetchData(filters = {}) {
  try {
    const params = new URLSearchParams();

    params.append("filter[CATEGORY_ID]", "1");
    params.append("filter[STAGE_ID][0]", PENDING_STAGE_ID);
    params.append("filter[STAGE_ID][1]", REJECTED_STAGE_ID);
    params.append("filter[STAGE_ID][2]", APPROVED_STAGE_ID);
    params.append("order[ID]", "desc");

    Object.keys(filters).forEach((key) => {
      params.append(`filter[${key}]`, filters[key]);
    });

    const selectFields = [
      "ID",
      "TITLE",
      "ASSIGNED_BY_ID",
      "UF_CRM_1743242265",
      "STAGE_ID",
      "CATEGORY_ID",
      "UF_CRM_1730898393184",
      "UF_CRM_1730898417615",
      "UF_CRM_1730898584288",
      "UF_CRM_1729232846225",
      "UF_CRM_1739344734264",
      "UF_CRM_1740118342834",
      "UF_CRM_671A261F34FD4",
    ];
    selectFields.forEach((field, index) => {
      params.append(`select[${index}]`, field);
    });

    const response = await fetch(
      `${API_BASE_URL}/crm.deal.list?${params.toString()}`
    );
    const data = await response.json();

    if (data.result) {
      console.log("Fetched deals:", data);
      return data;
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
  const result = await fetchData();
  const deals = await result["result"];

  async function renderStats(deals) {
    const totalDeals = deals.length;
    const totalCommission = deals.reduce(
      (sum, deal) => sum + (parseFloat(deal.UF_CRM_1740118342834) || 0),
      0
    );
    const totalFee = deals.reduce(
      (sum, deal) => sum + (parseFloat(deal.UF_CRM_1739344734264) || 0),
      0
    );

    document.getElementById("total-deals").textContent = totalDeals;
    document.getElementById("total-commission-amount").textContent = `AED ${
      totalCommission ? totalCommission.toLocaleString() : 0
    }`;
    document.getElementById("total-sales-progression-fee").textContent = `AED ${
      totalFee ? totalFee.toLocaleString() : 0
    }`;
  }

  function getLocation(deal) {
    const locations = [
      deal.UF_CRM_1730898393184,
      deal.UF_CRM_1730898417615,
      deal.UF_CRM_1730898584288,
      deal.UF_CRM_1729232846225,
    ];

    return locations.filter(Boolean).join(" - ").trim();
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function renderTable(containerId, data, total, page = 1) {
    const container = document.getElementById(containerId);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedData = data.slice(start, end);

    let html = `
          <table class="w-full text-left">
              <thead class="bg-gray-50">
                  <tr>
                      <th class="p-3 text-sm font-medium text-gray-500">SI No.</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Agent Name</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Property Address</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Commission Amount</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Sales Progression Fee</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Sales Progression Responsible</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Reason for Rejection</th>
                      <th class="p-3 text-sm font-medium text-gray-500">CRM Link</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Status</th>
                      <th class="p-3 text-sm font-medium text-gray-500">Action</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
      `;

    if (paginatedData.length === 0) {
      html += `
        <tr>
          <td colspan="10" class="p-3 text-sm text-gray-900 text-center">No data found</td>
        </tr>
      `;
    }

    paginatedData.forEach((deal, index) => {
      html += `
              <tr>
                  <td class="p-3 text-sm text-gray-900">${index + 1}</td>
                  <td class="p-3 text-sm text-gray-900">${getUserId(
                    deal.ASSIGNED_BY_ID
                  )}</td>
                  <td class="p-3 text-sm text-gray-900">${getLocation(
                    deal
                  )}</td>

                  <td class="p-3 text-sm text-gray-900">${
                    deal.UF_CRM_1740118342834
                      ? formatMoney(deal.UF_CRM_1740118342834)
                      : 0
                  }</td>
                  <td class="p-3 text-sm text-gray-900">${
                    deal.UF_CRM_1739344734264
                      ? formatMoney(deal.UF_CRM_1739344734264)
                      : 0
                  }</td>
                  <td class="p-3 text-sm text-gray-900">${getUserId(
                    deal.UF_CRM_1743242265
                  )}</td>
                  <td class="p-3 text-sm text-gray-900">${
                    deal.UF_CRM_671A261F34FD4
                      ? deal.UF_CRM_671A261F34FD4
                      : "N/A"
                  }</td>
                  <td class="p-3 text-sm text-gray-900">
                    <a href="https://crm.theluxuryrealestate.ae/crm/deal/details/${
                      deal.ID
                    }/" 
                      target="_blank" 
                      class="text-blue-600 hover:text-blue-800" 
                      title="${deal.TITLE}">
                      <i class="fas fa-link"></i>
                    </a>
                  </td>
                  <td class="p-3 text-sm capitalize ${
                    deal.STAGE_ID === APPROVED_STAGE_ID
                      ? "text-green-600"
                      : deal.STAGE_ID === PENDING_STAGE_ID
                      ? "text-red-600"
                      : "text-gray-600"
                  }">${getStatusFromStage(deal.STAGE_ID)}</td>
                  <td class="p-3">
                    ${
                      deal.STAGE_ID == APPROVED_STAGE_ID
                        ? `
                          <button onclick="updateStatus(${deal.ID}, 'rejected')" title="Reject" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-times"></i>
                          </button>
                        `
                        : deal.STAGE_ID == PENDING_STAGE_ID
                        ? `
                          <button onclick="updateStatus(${deal.ID}, 'approved')" title="Approve" class="text-green-600 hover:text-green-800 mr-2">
                            <i class="fas fa-check"></i>
                          </button>
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

    renderPagination(containerId.replace("-table", "-pagination"), total, page);
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
    let filters = {};

    if (sectionId === "approved-deals") {
      filters["STAGE_ID"] = APPROVED_STAGE_ID;
    } else if (sectionId === "rejected-deals") {
      filters["STAGE_ID"] = REJECTED_STAGE_ID;
    } else if (sectionId === "pending-deals") {
      filters["STAGE_ID"] = PENDING_STAGE_ID;
    }

    const result = await fetchData(filters);
    let data = (await result["result"]) || [];
    let total = result.total || 0;

    renderTable(`${sectionId}-table`, data, total, page);
    renderStats(data);
  };

  updateStatus = async function (dealId, newStatus) {
    let newStageId;
    let rejectionReason = "";

    if (newStatus === "approved") {
      newStageId = APPROVED_STAGE_ID;
    } else if (newStatus === "rejected") {
      newStageId = REJECTED_STAGE_ID;

      rejectionReason = prompt("Please enter the rejection reason:");

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
              UF_CRM_671A261F34FD4: rejectionReason,
            }),
          },
        }),
      });

      const data = await response.json();

      if (data.result) {
        renderSection(document.querySelector(".section:not(.hidden)").id);
        renderStats(data.result);
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
