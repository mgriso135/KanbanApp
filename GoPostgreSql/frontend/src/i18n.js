import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
  lng: 'en',
  fallbackLng: 'en',
  debug: false, // set to false to mute all console logs
    missingKeyHandler: (lng, ns, key) => {
       // You can log missing keys here if needed, or just mute them
      // console.warn(`i18next: Missing key "${key}" in namespace "${ns}" for language "${lng}".`);
    },
    resources: {
        en: {
        translation: {
             "appTitle": "Electronic Kanban",
              "dashboard": "Dashboard",
              "selectClient": "Select a client",
              "selectSupplier": "Select a supplier",
              "clientDashboard": "Client Dashboard",
              "supplierDashboard": "Supplier Dashboard",
              "add": "Add",
              "client": "Client",
              "supplier": "Supplier",
               "product": "Product",
              "kanban": "Kanban",
              "kanbanHistory": "Kanban History",
               "kanbanList": "Kanban List",
              "id": "ID",
              "productName": "Product",
             "customer": "Customer",
              "provider": "Supplier",
               "quantity": "Quantity",
               "type": "Type",
              "lastUpdate": "Last Update",
              "empty": "Empty",
             "activate": "Activate",
            "selectProduct": "Select a Product",
             "noKanbanFound": "No kanban found",
              "createClient": "Create Client",
               "createSupplier": "Create Supplier",
               "createProduct": "Create Product",
               "createKanban": "Create Kanban",
               "businessName": "Business Name",
               "address": "Address",
              "vatNumber": "VAT Number",
               "sdiCode": "SDI Code",
              "leadTime": "Lead Time",
               "numberOfCards": "Number of cards to create"
              }
            },
            it: {
            translation: {
                "appTitle": "Kanban Elettronico",
                "dashboard": "Dashboard",
                "selectClient": "Seleziona un cliente",
                "selectSupplier": "Seleziona un fornitore",
                "clientDashboard": "Dashboard Cliente",
                "supplierDashboard": "Dashboard Fornitore",
                "add": "Aggiungi",
                "client": "Cliente",
               "supplier": "Fornitore",
               "product": "Prodotto",
                "kanban": "Kanban",
                 "kanbanHistory": "Kanban History",
                "kanbanList": "Lista Kanban",
                 "id": "ID",
               "productName": "Prodotto",
              "customer": "Cliente",
             "provider": "Fornitore",
               "quantity": "Quantità",
                "type": "Tipo",
               "lastUpdate": "Ultimo Aggiornamento",
                 "empty": "Svuota",
               "activate": "Rendi Attivo",
             "selectProduct": "Seleziona un prodotto",
               "noKanbanFound": "Nessun kanban trovato",
                "createClient": "Crea Cliente",
                "createSupplier": "Crea Fornitore",
                 "createProduct": "Crea Prodotto",
                 "createKanban": "Crea Kanban",
                 "businessName": "Ragione Sociale",
                 "address": "Indirizzo",
                "vatNumber": "Partita IVA",
                  "sdiCode": "Codice SDI",
                 "leadTime": "Lead Time",
                  "numberOfCards": "Numero di cartellini da creare"
                }
             },
            es: {
              translation: {
                 "appTitle": "Kanban Electrónico",
                "dashboard": "Panel de control",
                  "selectClient": "Seleccionar un cliente",
                 "selectSupplier": "Seleccionar un proveedor",
                  "clientDashboard": "Panel de control del cliente",
                 "supplierDashboard": "Panel de control del proveedor",
                  "add": "Añadir",
                  "client": "Cliente",
                  "supplier": "Proveedor",
                 "product": "Producto",
                 "kanban": "Kanban",
                "kanbanHistory": "Historial de Kanban",
                 "kanbanList": "Lista de Kanban",
                  "id": "ID",
                 "productName": "Producto",
                  "customer": "Cliente",
                   "provider": "Proveedor",
                 "quantity": "Cantidad",
                  "type": "Tipo",
                  "lastUpdate": "Última actualización",
                   "empty": "Vaciar",
                    "activate": "Activar",
                   "selectProduct": "Seleccionar un producto",
                    "noKanbanFound": "No se encontraron kanban",
                     "createClient": "Crear Cliente",
                     "createSupplier": "Crear Proveedor",
                      "createProduct": "Crear Producto",
                      "createKanban": "Crear Kanban",
                     "businessName": "Razón Social",
                     "address": "Dirección",
                      "vatNumber": "Número de IVA",
                       "sdiCode": "Código SDI",
                       "leadTime": "Tiempo de entrega",
                     "numberOfCards": "Número de tarjetas a crear"
              }
            },
          zh: {
            translation:{
                "appTitle": "电子看板",
                "dashboard": "仪表板",
                "selectClient": "选择一个客户",
                "selectSupplier": "选择一个供应商",
                "clientDashboard": "客户仪表板",
                "supplierDashboard": "供应商仪表板",
                "add": "添加",
                "client": "客户",
                "supplier": "供应商",
                "product": "产品",
                "kanban": "看板",
                "kanbanHistory": "看板历史",
                 "kanbanList": "看板列表",
                 "id": "ID",
                  "productName": "产品名称",
                  "customer": "客户",
                   "provider": "供应商",
                  "quantity": "数量",
                  "type": "类型",
                  "lastUpdate": "最后更新",
                   "empty": "清空",
                    "activate": "激活",
                    "selectProduct": "选择产品",
                  "noKanbanFound": "未找到看板",
                    "createClient": "创建客户",
                   "createSupplier": "创建供应商",
                    "createProduct": "创建产品",
                    "createKanban": "创建看板",
                   "businessName": "公司名称",
                    "address": "地址",
                   "vatNumber": "增值税号",
                   "sdiCode": "SDI 代码",
                   "leadTime": "交货时间",
                   "numberOfCards": "要创建的卡片数量"
                }
           }
      }
});

export default i18n;