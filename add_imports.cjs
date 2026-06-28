const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/merchant/MerchantDashboard.tsx',
  'src/pages/merchant/MerchantOverview.tsx',
  'src/pages/merchant/MerchantReturns.tsx',
  'src/pages/admin/AdminOrders.tsx',
  'src/pages/admin/AdminReturns.tsx',
  'src/pages/admin/AdminOperations.tsx',
  'src/pages/admin/MainWarehouse.tsx',
  'src/pages/admin/IncomingMerchant.tsx',
  'src/pages/warehouse/WarehouseDispatch.tsx',
  'src/pages/warehouse/WarehouseIncomingOrders.tsx',
  'src/pages/warehouse/WarehouseInventory.tsx',
  'src/pages/warehouse/WarehousePullOrders.tsx',
  'src/pages/warehouse/WarehouseReturns.tsx',
  'src/pages/warehouse/WarehouseReturnsTransfer.tsx',
  'src/pages/driver/DeliveryOrders.tsx',
  'src/pages/driver/PostponedReturnedOrders.tsx',
  'src/pages/driver/PartialDelivery.tsx'
];

let totalUpdated = 0;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Add import if missing
  if (!content.includes('OrderTableCells')) {
    const importStatement = `import { OrderTableHeaders, OrderTableCells } from '../../components/OrderTableCells';\n`;
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
    } else {
      content = importStatement + content;
    }
  }

  // Adjust imports path if needed (for src/pages/* vs src/pages/*/*)
  const depth = filePath.split('/').length - 2;
  const relativePath = depth === 1 ? '../components/OrderTableCells' : '../../components/OrderTableCells';
  content = content.replace(/from '\.\.\/\.\.\/components\/OrderTableCells'/g, `from '${relativePath}'`);
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalUpdated++;
    console.log(`Updated imports in ${filePath}`);
  }
}

filesToUpdate.forEach(processFile);
console.log(`Total files modified: ${totalUpdated}`);
