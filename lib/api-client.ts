import { toast } from "sonner"
import type {
  ProductTemplate,
  Category,
  Brand,
  Uom,
  UomCategory,
  StockLocation,
  StockQuant,
  Pricelist,
  StockPicking,
  PurchaseOrder,
  Invoice,
  CreateProductTemplateRequest,
  UpdateProductTemplateRequest,
  CreateCategoryRequest,
  CreateBrandRequest,
  InventoryAdjustmentRequest,
  PaginatedResponse as InventoryPaginatedResponse,
  User,
  Organization,
  Role,
  Permission,
  Resource,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  CreateUserRequest,
  UpdateUserRequest,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  CreateResourceRequest,
  UpdateResourceRequest,
  PaginatedResponse,
} from "./types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api"

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// =============================================================================
// MOCK DATA (matches API response structure for fallback)
// =============================================================================

const MOCK_PRODUCTS: ProductTemplate[] = [
  {
    id: 1,
    name: "Schezwan Egg Noodles",
    type: "storable",
    default_code: "FOOD-001",
    barcode: "1234567890001",
    description: "Delicious schezwan egg noodles",
    description_sale: "Spicy and flavorful noodles",
    description_purchase: "",
    category_id: 1,
    category: { id: 1, name: "Lunch", code: "LUNCH", full_path: "Lunch", level: 0 },
    brand_id: null,
    list_price: 24.0,
    standard_price: 12.0,
    compare_price: 30.0,
    margin: 50,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.5,
    volume: 0,
    hs_code: "",
    min_stock_qty: 10,
    max_stock_qty: 100,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🍜",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Spicy Fried Chicken",
    type: "storable",
    default_code: "FOOD-002",
    barcode: "1234567890002",
    description: "Crispy fried chicken",
    description_sale: "Extra crispy and spicy",
    description_purchase: "",
    category_id: 1,
    category: { id: 1, name: "Lunch", code: "LUNCH", full_path: "Lunch", level: 0 },
    brand_id: null,
    list_price: 45.7,
    standard_price: 22.0,
    compare_price: 50.0,
    margin: 51,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.3,
    volume: 0,
    hs_code: "",
    min_stock_qty: 10,
    max_stock_qty: 200,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🍗",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Grilled Steak",
    type: "storable",
    default_code: "FOOD-003",
    barcode: "1234567890003",
    description: "Premium grilled steak",
    description_sale: "Perfectly grilled to your preference",
    description_purchase: "",
    category_id: 1,
    category: { id: 1, name: "Lunch", code: "LUNCH", full_path: "Lunch", level: 0 },
    brand_id: null,
    list_price: 80.0,
    standard_price: 40.0,
    compare_price: 95.0,
    margin: 50,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.4,
    volume: 0,
    hs_code: "",
    min_stock_qty: 5,
    max_stock_qty: 50,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🥩",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Pasta Bolognese",
    type: "storable",
    default_code: "FOOD-004",
    barcode: "1234567890004",
    description: "Classic Italian pasta",
    description_sale: "Homemade meat sauce",
    description_purchase: "",
    category_id: 1,
    category: { id: 1, name: "Lunch", code: "LUNCH", full_path: "Lunch", level: 0 },
    brand_id: null,
    list_price: 50.5,
    standard_price: 25.0,
    compare_price: 60.0,
    margin: 50,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.45,
    volume: 0,
    hs_code: "",
    min_stock_qty: 10,
    max_stock_qty: 80,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🍝",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Raspberry Tart",
    type: "storable",
    default_code: "DSRT-001",
    barcode: "1234567890005",
    description: "Fresh raspberry tart",
    description_sale: "Made with fresh berries",
    description_purchase: "",
    category_id: 2,
    category: { id: 2, name: "Desserts", code: "DSRT", full_path: "Desserts", level: 0 },
    brand_id: null,
    list_price: 8.12,
    standard_price: 4.0,
    compare_price: 10.0,
    margin: 50,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.15,
    volume: 0,
    hs_code: "",
    min_stock_qty: 10,
    max_stock_qty: 60,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🍰",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Chocolate Cake",
    type: "storable",
    default_code: "DSRT-002",
    barcode: "1234567890006",
    description: "Rich chocolate cake",
    description_sale: "Triple chocolate delight",
    description_purchase: "",
    category_id: 2,
    category: { id: 2, name: "Desserts", code: "DSRT", full_path: "Desserts", level: 0 },
    brand_id: null,
    list_price: 24.86,
    standard_price: 12.0,
    compare_price: 30.0,
    margin: 51,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.8,
    volume: 0,
    hs_code: "",
    min_stock_qty: 5,
    max_stock_qty: 50,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🎂",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 35,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Fish and Chips",
    type: "storable",
    default_code: "FOOD-007",
    barcode: "1234567890007",
    description: "Classic fish and chips",
    description_sale: "Beer-battered fish with crispy fries",
    description_purchase: "",
    category_id: 1,
    category: { id: 1, name: "Lunch", code: "LUNCH", full_path: "Lunch", level: 0 },
    brand_id: null,
    list_price: 90.4,
    standard_price: 45.0,
    compare_price: 100.0,
    margin: 50,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.5,
    volume: 0,
    hs_code: "",
    min_stock_qty: 5,
    max_stock_qty: 40,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🐟",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: "Soup",
    type: "storable",
    default_code: "STRT-001",
    barcode: "1234567890008",
    description: "Homemade soup",
    description_sale: "Chef's special soup of the day",
    description_purchase: "",
    category_id: 3,
    category: { id: 3, name: "Starters", code: "STRT", full_path: "Starters", level: 0 },
    brand_id: null,
    list_price: 35.3,
    standard_price: 15.0,
    compare_price: 40.0,
    margin: 57,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.3,
    volume: 0,
    hs_code: "",
    min_stock_qty: 10,
    max_stock_qty: 80,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🥣",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 9,
    name: "Coffee",
    type: "storable",
    default_code: "BEV-001",
    barcode: "1234567890009",
    description: "Premium coffee",
    description_sale: "Freshly brewed",
    description_purchase: "",
    category_id: 4,
    category: { id: 4, name: "Beverages", code: "BEV", full_path: "Beverages", level: 0 },
    brand_id: null,
    list_price: 4.5,
    standard_price: 1.5,
    compare_price: 5.0,
    margin: 66,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.3,
    volume: 0,
    hs_code: "",
    min_stock_qty: 50,
    max_stock_qty: 300,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "☕",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 10,
    name: "Fresh Juice",
    type: "storable",
    default_code: "BEV-002",
    barcode: "1234567890010",
    description: "Fresh fruit juice",
    description_sale: "Made from fresh fruits",
    description_purchase: "",
    category_id: 4,
    category: { id: 4, name: "Beverages", code: "BEV", full_path: "Beverages", level: 0 },
    brand_id: null,
    list_price: 5.0,
    standard_price: 2.0,
    compare_price: 6.0,
    margin: 60,
    uom_id: 1,
    uom: { id: 1, name: "Unit", uom_type: "reference", ratio: 1 },
    uom_po_id: 1,
    tracking: "none",
    sale_ok: true,
    purchase_ok: true,
    is_published: true,
    weight: 0.35,
    volume: 0,
    hs_code: "",
    min_stock_qty: 30,
    max_stock_qty: 200,
    invoice_policy: "order",
    taxes_id: [],
    supplier_taxes_id: [],
    image_url: "🧃",
    image_urls: [],
    active: true,
    company_id: null,
    variant_count: 1,
    qty_available: 150,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Lunch",
    code: "LUNCH",
    parent_id: null,
    full_path: "Lunch",
    level: 0,
    sequence: 1,
    description: "Lunch menu items",
    image_url: "",
    active: true,
    company_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Desserts",
    code: "DSRT",
    parent_id: null,
    full_path: "Desserts",
    level: 0,
    sequence: 2,
    description: "Dessert items",
    image_url: "",
    active: true,
    company_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Starters",
    code: "STRT",
    parent_id: null,
    full_path: "Starters",
    level: 0,
    sequence: 3,
    description: "Appetizers and starters",
    image_url: "",
    active: true,
    company_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Beverages",
    code: "BEV",
    parent_id: null,
    full_path: "Beverages",
    level: 0,
    sequence: 4,
    description: "Drinks and beverages",
    image_url: "",
    active: true,
    company_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_BRANDS: Brand[] = [
  {
    id: 1,
    name: "House Brand",
    code: "HB",
    description: "Our signature brand",
    logo_url: "",
    website: "",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_STOCK: StockQuant[] = MOCK_PRODUCTS.map((p, index) => ({
  id: index + 1,
  product_id: p.id,
  product: {
    id: p.id,
    default_code: p.default_code,
    barcode: p.barcode,
    combination_name: "",
    list_price: p.list_price,
    qty_available: p.qty_available,
    image_url: p.image_url,
  },
  location_id: 1,
  location: {
    id: 1,
    name: "Main Warehouse",
    code: "WH-MAIN",
    full_path: "Main Warehouse",
    location_type: "internal",
  },
  lot_id: null,
  quantity: p.qty_available,
  reserved_qty: 0,
  available_qty: p.qty_available,
  company_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

const MOCK_PURCHASES: PurchaseOrder[] = [
  {
    id: 1,
    name: "PO-2025-001",
    supplier_id: 1,
    supplier_name: "Food Supplies Co",
    order_date: "2025-01-10",
    expected_date: "2025-01-15",
    total_amount: 5000,
    status: "delivered",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "PO-2025-002",
    supplier_id: 2,
    supplier_name: "Global Food Inc",
    order_date: "2025-01-12",
    expected_date: "2025-01-18",
    total_amount: 3500,
    status: "in_transit",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_INVOICES: Invoice[] = [
  {
    id: 1,
    invoice_number: "INV-2025-001",
    client_id: 1,
    client_name: "ABC Corp",
    issue_date: "2025-01-15",
    due_date: "2025-02-15",
    total_amount: 48.0,
    status: "paid",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    invoice_number: "INV-2025-002",
    client_id: 2,
    client_name: "XYZ Ltd",
    issue_date: "2025-01-14",
    due_date: "2025-02-14",
    total_amount: 1141.5,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    invoice_number: "INV-2025-003",
    client_id: 3,
    client_name: "Tech Partners",
    issue_date: "2025-01-13",
    due_date: "2025-01-28",
    total_amount: 35.3,
    status: "overdue",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// =============================================================================
// API CALL HELPERS
// =============================================================================

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint}`
    console.log("[API] Call:", url)

    const { headers: optionsHeaders, ...restOptions } = options
    const response = await fetch(url, {
      ...restOptions,
      method: options.method || "GET",
      mode: "cors", // Enable CORS
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(optionsHeaders as Record<string, string>),
      },
    })

    if (!response.ok) {
      console.log("[API] Error - Status:", response.status)
      
      // Handle 401 - Try to refresh token
      if (response.status === 401) {
        // If this is already a refresh token request, it means refresh failed - logout
        if (endpoint === "/auth/refresh") {
          removeAuthTokens()
          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.href = "/login"
          }
          return {
            error: "Session expired. Please login again.",
          }
        }

        // Attempt to refresh the token
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          // Retry the original request with new token
          const retryHeaders = {
            ...(optionsHeaders as Record<string, string>),
            ...getAuthHeaders(),
          }
          const retryResponse = await fetch(url, {
            ...restOptions,
            method: options.method || "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              ...retryHeaders,
            },
          })

          if (retryResponse.ok) {
            const contentType = retryResponse.headers.get("content-type")
            if (contentType && contentType.includes("application/json")) {
              const data = await retryResponse.json()
              return { data }
            }
            return { data: null as T }
          } else {
            // Retry still failed, but don't logout - just return the error
            // Only logout if refresh token itself failed (handled above)
            try {
              const contentType = retryResponse.headers.get("content-type")
              if (contentType && contentType.includes("application/json")) {
                const errorData = await retryResponse.json()
                return {
                  error: errorData.error || errorData.message || "Unauthorized",
                }
              }
            } catch (parseError) {
              console.error("Failed to parse error response:", parseError)
            }
            return {
              error: "Unauthorized",
            }
          }
        } else {
          // Refresh failed, clear tokens and redirect to login
          removeAuthTokens()
          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.href = "/login"
          }
          return {
            error: "Session expired. Please login again.",
          }
        }
      }

      if (response.status === 403) {
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            // Extract error message from response (could be "error" field or message)
            const errorMessage = errorData.error || errorData.message || "You do not have sufficient permissions to perform this action."
            return {
              error: errorMessage,
            }
          }
        } catch (parseError) {
          // If parsing fails, use default message
          console.error("Failed to parse 403 error response:", parseError)
        }
       return {
        error: "You do not have sufficient permissions to perform this action.",
       }
      }
      
      return {
        error: `HTTP Error: ${response.status}`,
      }
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.log("[API] Error - Invalid content type:", contentType)
      return {
        error: "Invalid response format from API. Ensure the API is running correctly.",
      }
    }

    const data = await response.json()
    console.log("[API] Success:", endpoint)
    return { data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.log("[API] Exception:", errorMessage)
    return {
      error: errorMessage,
    }
  }
}

async function apiCallWithFallback<T>(
  endpoint: string,
  mockData: T,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const result = await apiCall<T>(endpoint, options)

  if (result.error) {
    console.log("[API] Using mock data for:", endpoint)
    return { data: mockData }
  }

  return result
}

// =============================================================================
// INVENTORY API
// =============================================================================

export const inventoryAPI = {
  // Products
  getProducts: async (): Promise<ApiResponse<ProductTemplate[]>> => {
    const result = await apiCall<PaginatedResponse<ProductTemplate>>("/inventory/products?page_size=1000")
    if (result.error) {
      console.log("[API] Using mock data for products")
      return { data: MOCK_PRODUCTS }
    }
    // Extract the array from the paginated response
    return { data: result.data?.data || [] }
  },
  
  getProductById: (id: number) => apiCall<ProductTemplate>(`/inventory/products/${id}`),
  
  getProductByBarcode: (barcode: string) => apiCall<ProductTemplate>(`/inventory/products/barcode/${barcode}`),
  
  createProduct: (data: CreateProductTemplateRequest) =>
    apiCall<ProductTemplate>("/inventory/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  updateProduct: (id: number, data: UpdateProductTemplateRequest) =>
    apiCall<ProductTemplate>(`/inventory/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  deleteProduct: (id: number) =>
    apiCall<void>(`/inventory/products/${id}`, {
      method: "DELETE",
    }),
  
  bulkUpdateStatus: (data: { ids: number[]; active: boolean }) =>
    apiCall<void>("/inventory/products/bulk/status", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  bulkDelete: (data: { ids: number[] }) =>
    apiCall<void>("/inventory/products/bulk/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  getVariants: (templateId: number) => apiCall(`/inventory/products/templates/${templateId}/variants`),

  // Categories
  getCategories: () => apiCallWithFallback<Category[]>("/inventory/categories", MOCK_CATEGORIES),
  
  getCategoryTree: () => apiCall("/inventory/categories/tree"),
  
  getCategoryById: (id: number) => apiCall<Category>(`/inventory/categories/${id}`),
  
  createCategory: (data: CreateCategoryRequest) =>
    apiCall<Category>("/inventory/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  updateCategory: (id: number, data: Partial<CreateCategoryRequest>) =>
    apiCall<Category>(`/inventory/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  deleteCategory: (id: number) =>
    apiCall<void>(`/inventory/categories/${id}`, {
      method: "DELETE",
    }),

  // Brands
  getBrands: () => apiCallWithFallback<Brand[]>("/inventory/brands", MOCK_BRANDS),
  
  getBrandById: (id: number) => apiCall<Brand>(`/inventory/brands/${id}`),
  
  createBrand: (data: CreateBrandRequest) =>
    apiCall<Brand>("/inventory/brands", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  updateBrand: (id: number, data: Partial<CreateBrandRequest>) =>
    apiCall<Brand>(`/inventory/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  deleteBrand: (id: number) =>
    apiCall<void>(`/inventory/brands/${id}`, {
      method: "DELETE",
    }),

  // Stock
  getStock: () => apiCallWithFallback<StockQuant[]>("/inventory/stock", MOCK_STOCK),
  
  getStockByProduct: (productId: number) => apiCall(`/inventory/stock/product/${productId}`),
  
  getStockByLocation: (locationId: number) => apiCall(`/inventory/stock/location/${locationId}`),
  
  adjustStock: (data: InventoryAdjustmentRequest) =>
    apiCall("/inventory/stock/adjust", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Locations
  getLocations: () => apiCall<StockLocation[]>("/inventory/locations"),
  
  getLocationTree: () => apiCall("/inventory/locations/tree"),
  
  getInternalLocations: () => apiCall<StockLocation[]>("/inventory/locations/internal"),

  // UOMs
  getUoms: () => apiCall<Uom[]>("/inventory/uoms"),
  
  getUomCategories: () => apiCall<UomCategory[]>("/inventory/uom-categories"),

  // Pricelists
  getPricelists: () => apiCall<Pricelist[]>("/inventory/pricelists"),
  
  computePrice: (data: { pricelist_id: number; product_id: number; quantity: number }) =>
    apiCall("/inventory/pricelists/compute-price", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  bulkComputePrice: (data: { pricelist_id: number; products: { product_id: number; quantity: number }[] }) =>
    apiCall("/inventory/pricelists/compute-price/bulk", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Pickings
  getPickings: () => apiCall<StockPicking[]>("/inventory/pickings"),
  
  createPicking: (data: unknown) =>
    apiCall<StockPicking>("/inventory/pickings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  confirmPicking: (id: number) =>
    apiCall(`/inventory/pickings/${id}/confirm`, {
      method: "POST",
    }),
  
  validatePicking: (id: number, data: unknown) =>
    apiCall(`/inventory/pickings/${id}/validate`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// =============================================================================
// SALES API (placeholder - uses mock data until API is implemented)
// =============================================================================

export const salesAPI = {
  getSales: () =>
    apiCallWithFallback("/sales/orders", []),
  
  getSaleById: (id: number) => apiCall(`/sales/orders/${id}`),
  
  createSale: (data: unknown) =>
    apiCall("/sales/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  updateSale: (id: number, data: unknown) =>
    apiCall(`/sales/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// =============================================================================
// PURCHASE API (placeholder - uses mock data until API is implemented)
// =============================================================================

export const purchaseAPI = {
  getPurchases: () => apiCallWithFallback<PurchaseOrder[]>("/purchase/orders", MOCK_PURCHASES),
  
  getPurchaseById: (id: number) => apiCall<PurchaseOrder>(`/purchase/orders/${id}`),
  
  createPurchase: (data: unknown) =>
    apiCall<PurchaseOrder>("/purchase/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  updatePurchase: (id: number, data: unknown) =>
    apiCall<PurchaseOrder>(`/purchase/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// =============================================================================
// INVOICING API (placeholder - uses mock data until API is implemented)
// =============================================================================

export const invoicingAPI = {
  getInvoices: () => apiCallWithFallback<Invoice[]>("/invoicing/invoices", MOCK_INVOICES),
  
  getInvoiceById: (id: number) => apiCall<Invoice>(`/invoicing/invoices/${id}`),
  
  createInvoice: (data: unknown) =>
    apiCall<Invoice>("/invoicing/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  updateInvoice: (id: number, data: unknown) =>
    apiCall<Invoice>(`/invoicing/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// =============================================================================
// IAM API
// =============================================================================

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// Helper to get refresh token from localStorage
function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("refresh_token")
}

// Helper to set auth token in localStorage
function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_token", token)
}

// Helper to set refresh token in localStorage
function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("refresh_token", token)
}

// Helper to remove auth tokens from localStorage
function removeAuthTokens(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_token")
  localStorage.removeItem("refresh_token")
}

// Helper to refresh access token (direct fetch to avoid recursion)
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return false
  }

  try {
    const url = `${BASE_URL}/auth/refresh`
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      return false
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      return false
    }

    const data: RefreshTokenResponse = await response.json()
    if (data.access_token) {
      setAuthToken(data.access_token)
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token)
      }
      return true
    }
    return false
  } catch (error) {
    console.error("Token refresh failed:", error)
    return false
  }
}

// Helper to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Simple cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData<T>(key: string): T | null {
  const cached = apiCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  return null
}

function setCachedData<T>(key: string, data: T): void {
  apiCache.set(key, { data, timestamp: Date.now() })
}

export function clearCache(pattern?: string): void {
  if (pattern) {
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key)
      }
    }
  } else {
    apiCache.clear()
  }
}

export const iamAPI = {
  // Authentication
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const result = await apiCall<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (result.data?.access_token) {
      setAuthToken(result.data.access_token)
      if (result.data.refresh_token) {
        setRefreshToken(result.data.refresh_token)
      }
    }
    return result
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    return apiCall<RefreshTokenResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const result = await apiCall<void>("/auth/logout", {
      method: "POST",
      headers: getAuthHeaders(),
    })
    removeAuthTokens()
    clearCache() // Clear all cached data on logout
    return result
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiCall<User>("/auth/me", {
      headers: getAuthHeaders(),
    })
  },

  // Users
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const result = await apiCall<PaginatedResponse<User>>("/users?includes[0]=roles", {
      headers: getAuthHeaders(),
    })
    // Extract data array from paginated response
    if (result.data) {
      return { data: result.data.data, error: result.error }
    }
    return { error: result.error }
  },

  getUserById: (id: string): Promise<ApiResponse<User>> => {
    return apiCall<User>(`/users/${id}`, {
      headers: getAuthHeaders(),
    })
  },

  createUser: async (data: CreateUserRequest, isSystemUser: boolean = false): Promise<ApiResponse<User>> => {
    // If organization_id is provided, use system endpoint for creating user under organization
    if (data.organization_id) {
      const result = await apiCall<User>("/system/organizations/users", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          organization_id: data.organization_id,
          phone: data.phone,
          firstname: data.firstname,
          middlename: data.middlename,
          lastname: data.lastname,
          password: data.password,
        }),
      })
      clearCache("users")
      return result
    }
    // Otherwise use regular endpoint (organization_id will be set from token)
    const userData = { ...data }
    const result = await apiCall<User>("/users", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })
    clearCache("users")
    return result
  },

  updateUser: (id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return apiCall<User>(`/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
  },

  deleteUser: (id: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
  },

  // Get users by organization ID (system endpoint)
  getUsersByOrganization: async (organizationId: string): Promise<ApiResponse<User[]>> => {
    const cacheKey = `users_org_${organizationId}`
    const cached = getCachedData<User[]>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<PaginatedResponse<User>>(`/system/organizations/users/${organizationId}`, {
      headers: getAuthHeaders(),
    })
    if (result.data) {
      setCachedData(cacheKey, result.data.data)
      return { data: result.data.data, error: result.error }
    }
    return { error: result.error }
  },

  // Organizations
  getOrganizations: async (): Promise<ApiResponse<Organization[]>> => {
    const cacheKey = "organizations"
    const cached = getCachedData<Organization[]>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<PaginatedResponse<Organization>>("/organizations", {
      headers: getAuthHeaders(),
    })
    // Extract data array from paginated response
    if (result.data) {
      setCachedData(cacheKey, result.data.data)
      return { data: result.data.data, error: result.error }
    }
    return { error: result.error }
  },

  getOrganizationById: async (id: string): Promise<ApiResponse<Organization>> => {
    const cacheKey = `organization_${id}`
    const cached = getCachedData<Organization>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<Organization>(`/organizations/${id}`, {
      headers: getAuthHeaders(),
    })
    if (result.data) {
      setCachedData(cacheKey, result.data)
    }
    return result
  },

  createOrganization: async (data: CreateOrganizationRequest): Promise<ApiResponse<Organization>> => {
    const result = await apiCall<Organization>("/system/organizations", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    clearCache("organizations")
    return result
  },

  updateOrganization: async (id: string, data: UpdateOrganizationRequest): Promise<ApiResponse<Organization>> => {
    const result = await apiCall<Organization>(`/system/organizations/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    clearCache("organizations")
    clearCache(`organization_${id}`)
    return result
  },

  deleteOrganization: async (id: string): Promise<ApiResponse<void>> => {
    const result = await apiCall<void>(`/system/organizations/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    clearCache("organizations")
    clearCache(`organization_${id}`)
    return result
  },

  // Roles
  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const cacheKey = "roles"
    const cached = getCachedData<Role[]>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<PaginatedResponse<Role>>("/roles", {
      headers: getAuthHeaders(),
    })
    if (result.data) {
      setCachedData(cacheKey, result.data.data)
      return { data: result.data.data, error: result.error }
    }
    return { error: result.error }
  },

  getRoleById: async (id: string): Promise<ApiResponse<Role>> => {
    const cacheKey = `role_${id}`
    const cached = getCachedData<Role>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<Role>(`/roles/${id}`, {
      headers: getAuthHeaders(),
    })
    if (result.data) {
      setCachedData(cacheKey, result.data)
    }
    return result
  },

  createRole: async (data: CreateRoleRequest): Promise<ApiResponse<Role>> => {
    const result = await apiCall<Role>("/roles", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    clearCache("roles")
    return result
  },

  updateRole: async (id: string, data: UpdateRoleRequest): Promise<ApiResponse<Role>> => {
    const result = await apiCall<Role>(`/roles/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    clearCache("roles")
    clearCache(`role_${id}`)
    return result
  },

  deleteRole: async (id: string): Promise<ApiResponse<void>> => {
    const result = await apiCall<void>(`/roles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    clearCache("roles")
    clearCache(`role_${id}`)
    return result
  },

  // Permissions
  getPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    const cacheKey = "permissions"
    const cached = getCachedData<Permission[]>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<PaginatedResponse<Permission>>("/permissions", {
      headers: getAuthHeaders(),
    })
    // Extract data array from paginated response
    if (result.data) {
      setCachedData(cacheKey, result.data.data)
      return { data: result.data.data, error: result.error }
    }
    return { error: result.error }
  },

  getPermissionById: async (id: string): Promise<ApiResponse<Permission>> => {
    const cacheKey = `permission_${id}`
    const cached = getCachedData<Permission>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<Permission>(`/permissions/${id}`, {
      headers: getAuthHeaders(),
    })
    if (result.data) {
      setCachedData(cacheKey, result.data)
    }
    return result
  },

  createPermission: async (data: CreatePermissionRequest): Promise<ApiResponse<Permission>> => {
    const result = await apiCall<Permission>("/permissions", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    clearCache("permissions")
    return result
  },

  updatePermission: async (id: string, data: UpdatePermissionRequest): Promise<ApiResponse<Permission>> => {
    const result = await apiCall<Permission>(`/permissions/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    clearCache("permissions")
    clearCache(`permission_${id}`)
    return result
  },

  deletePermission: async (id: string): Promise<ApiResponse<void>> => {
    const result = await apiCall<void>(`/permissions/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    clearCache("permissions")
    clearCache(`permission_${id}`)
    return result
  },

  // Resources
  getResources: async (): Promise<ApiResponse<Resource[]>> => {
    const cacheKey = "resources"
    const cached = getCachedData<Resource[]>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<PaginatedResponse<Resource>>("/resources", {
      headers: getAuthHeaders(),
    })
    // Extract data array from paginated response
    if (result.data) {
      setCachedData(cacheKey, result.data.data)
      return { data: result.data.data, error: result.error }
    }
    return { error: result.error }
  },

  getResourceById: async (id: string): Promise<ApiResponse<Resource>> => {
    const cacheKey = `resource_${id}`
    const cached = getCachedData<Resource>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<Resource>(`/resources/${id}`, {
      headers: getAuthHeaders(),
    })
    if (result.data) {
      setCachedData(cacheKey, result.data)
    }
    return result
  },

  createResource: async (data: CreateResourceRequest): Promise<ApiResponse<Resource>> => {
    const result = await apiCall<Resource>("/resources", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    clearCache("resources")
    return result
  },

  updateResource: async (id: string, data: UpdateResourceRequest): Promise<ApiResponse<Resource>> => {
    const result = await apiCall<Resource>(`/resources/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    clearCache("resources")
    clearCache(`resource_${id}`)
    return result
  },

  deleteResource: async (id: string): Promise<ApiResponse<void>> => {
    const result = await apiCall<void>(`/resources/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    clearCache("resources")
    clearCache(`resource_${id}`)
    return result
  },

  // Resource Permissions
  getResourcePermissions: async (): Promise<ApiResponse<any[]>> => {
    const cacheKey = "resource_permissions"
    const cached = getCachedData<any[]>(cacheKey)
    if (cached) {
      return { data: cached }
    }

    const result = await apiCall<PaginatedResponse<any>>("/resource-permissions?includes[0]=resource&includes[1]=permission", {
      headers: getAuthHeaders(),
    })
    if (result.data) {
      setCachedData(cacheKey, result.data.data)
      return { data: result.data.data, error: result.error }
    }
    return { error: result.error }
  },

  // Assign resource permissions to role
  assignResourcePermissionsToRole: async (
    roleId: string,
    resourcePermissionIds: string[],
    isSystemRole: boolean = false,
    isSystemUser: boolean = false
  ): Promise<ApiResponse<void>> => {
    // Use system endpoint for system roles (only if user is system)
    const endpoint = isSystemRole && isSystemUser
      ? `/system/roles/${roleId}/resource-permissions`
      : `/roles/${roleId}/resource-permissions`
    
    const result = await apiCall<void>(endpoint, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({resource_permission_ids: resourcePermissionIds }),
    })
    clearCache(`role_${roleId}`)
    clearCache("roles")
    return result
  },

  // Assign roles to user
  assignRolesToUser: async (userId: string, role_ids: string[]): Promise<ApiResponse<void>> => {
    const result = await apiCall<void>(`/users/${userId}/roles`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role_ids }),
    })
    clearCache(`users`)
    clearCache(`user_${userId}`)
    return result
  },
}
