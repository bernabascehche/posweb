// =============================================================================
// API Response Types
// =============================================================================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// =============================================================================
// PRODUCT TYPES
// =============================================================================

export interface ProductTemplate {
  id: number
  name: string
  type: "storable" | "consumable" | "service"
  default_code: string
  barcode: string
  description: string
  description_sale: string
  description_purchase: string
  category_id: number | null
  category?: CategorySimple
  brand_id: number | null
  brand?: BrandSimple
  list_price: number
  standard_price: number
  compare_price: number
  margin: number
  uom_id: number
  uom?: UomSimple
  uom_po_id: number
  uom_po?: UomSimple
  tracking: "none" | "lot" | "serial"
  sale_ok: boolean
  purchase_ok: boolean
  is_published: boolean
  weight: number
  volume: number
  hs_code: string
  min_stock_qty: number
  max_stock_qty: number
  invoice_policy: "order" | "delivery"
  taxes_id: number[]
  supplier_taxes_id: number[]
  image_url: string
  image_urls: string[]
  active: boolean
  company_id: number | null
  variant_count: number
  variants?: ProductVariantSimple[]
  attribute_lines?: AttributeLine[]
  qty_available: number
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: number
  product_tmpl_id: number
  template?: ProductTemplateSimple
  default_code: string
  barcode: string
  display_name: string
  combination_name: string
  list_price: number
  list_price_extra: number
  standard_price: number
  weight: number
  volume: number
  image_url: string
  active: boolean
  company_id: number | null
  attribute_values?: AttributeValueSimple[]
  qty_available: number
  qty_on_hand: number
  qty_reserved: number
  created_at: string
  updated_at: string
}

export interface ProductTemplateSimple {
  id: number
  name: string
  default_code: string
  list_price: number
  image_url: string
  active: boolean
}

export interface ProductVariantSimple {
  id: number
  default_code: string
  barcode: string
  combination_name: string
  list_price: number
  qty_available: number
  image_url: string
}

export interface AttributeLine {
  id: number
  attribute_id: number
  attribute_name: string
  values: AttributeValueSimple[]
}

export interface AttributeValueSimple {
  id: number
  name: string
  attribute_id: number
  attribute_name: string
}

// =============================================================================
// CATEGORY TYPES
// =============================================================================

export interface Category {
  id: number
  name: string
  code: string
  parent_id: number | null
  parent?: CategorySimple
  full_path: string
  level: number
  sequence: number
  description: string
  image_url: string
  active: boolean
  company_id: number | null
  children?: CategorySimple[]
  created_at: string
  updated_at: string
}

export interface CategorySimple {
  id: number
  name: string
  code: string
  full_path: string
  level: number
}

export interface CategoryTree {
  id: number
  name: string
  code: string
  children?: CategoryTree[]
}

// =============================================================================
// BRAND TYPES
// =============================================================================

export interface Brand {
  id: number
  name: string
  code: string
  description: string
  logo_url: string
  website: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface BrandSimple {
  id: number
  name: string
  code: string
  logo_url: string
}

// =============================================================================
// UOM TYPES
// =============================================================================

export interface Uom {
  id: number
  name: string
  category_id: number
  category_name: string
  uom_type: "reference" | "bigger" | "smaller"
  ratio: number
  rounding: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface UomSimple {
  id: number
  name: string
  uom_type: string
  ratio: number
}

export interface UomCategory {
  id: number
  name: string
  uoms?: UomSimple[]
  created_at: string
  updated_at: string
}

// =============================================================================
// STOCK TYPES
// =============================================================================

export interface StockLocation {
  id: number
  name: string
  code: string
  parent_id: number | null
  parent?: LocationSimple
  location_type: "internal" | "supplier" | "customer" | "inventory" | "production" | "transit"
  full_path: string
  barcode: string
  active: boolean
  company_id: number | null
  children?: LocationSimple[]
  created_at: string
  updated_at: string
}

export interface LocationSimple {
  id: number
  name: string
  code: string
  full_path: string
  location_type: string
}

export interface LocationTree {
  id: number
  name: string
  code: string
  location_type: string
  children?: LocationTree[]
}

export interface StockQuant {
  id: number
  product_id: number
  product?: ProductVariantSimple
  location_id: number
  location?: LocationSimple
  lot_id: number | null
  lot?: LotSimple
  quantity: number
  reserved_qty: number
  available_qty: number
  company_id: number | null
  created_at: string
  updated_at: string
}

export interface LotSimple {
  id: number
  name: string
  expiration_date: string | null
  is_expired: boolean
}

export interface ProductStock {
  product_id: number
  product?: ProductVariantSimple
  qty_on_hand: number
  qty_reserved: number
  qty_available: number
  qty_incoming: number
  qty_outgoing: number
  location_details?: LocationStock[]
}

export interface LocationStock {
  location_id: number
  location?: LocationSimple
  qty_on_hand: number
  qty_reserved: number
  qty_available: number
}

// =============================================================================
// STOCK PICKING TYPES
// =============================================================================

export interface StockPicking {
  id: number
  name: string
  origin: string
  picking_type_code: "incoming" | "outgoing" | "internal"
  state: "draft" | "waiting" | "confirmed" | "assigned" | "done" | "cancelled"
  priority: number
  scheduled_date: string | null
  effective_date: string | null
  location_id: number
  location?: LocationSimple
  location_dest_id: number
  location_dest?: LocationSimple
  note: string
  company_id: number | null
  moves?: StockMove[]
  move_count: number
  created_at: string
  updated_at: string
}

export interface StockMove {
  id: number
  name: string
  product_id: number
  product?: ProductVariantSimple
  product_qty: number
  qty_done: number
  qty_remaining: number
  product_uom_id: number
  product_uom?: UomSimple
  location_id: number
  location?: LocationSimple
  location_dest_id: number
  location_dest?: LocationSimple
  picking_id: number | null
  picking?: PickingSimple
  lot_id: number | null
  lot?: LotSimple
  state: string
  origin_doc_type: string
  origin_doc_id: number | null
  company_id: number | null
  created_at: string
  updated_at: string
}

export interface PickingSimple {
  id: number
  name: string
  state: string
  picking_type_code: string
}

// =============================================================================
// PRICELIST TYPES
// =============================================================================

export interface Pricelist {
  id: number
  name: string
  code: string
  active: boolean
  currency_code: string
  discount_policy: "with_discount" | "without_discount"
  company_id: number | null
  items?: PricelistItem[]
  created_at: string
  updated_at: string
}

export interface PricelistItem {
  id: number
  pricelist_id: number
  applied_on: "global" | "category" | "product" | "variant"
  category_id: number | null
  product_tmpl_id: number | null
  product_id: number | null
  min_quantity: number
  compute_price: "fixed" | "percentage" | "formula"
  fixed_price: number
  percent_price: number
  date_start: string | null
  date_end: string | null
  active: boolean
  created_at: string
  updated_at: string
}

// =============================================================================
// PURCHASE TYPES (for future API implementation)
// =============================================================================

export interface PurchaseOrder {
  id: number
  name: string
  supplier_id: number
  supplier_name: string
  order_date: string
  expected_date: string | null
  total_amount: number
  status: "draft" | "confirmed" | "in_transit" | "delivered" | "cancelled"
  items?: PurchaseOrderItem[]
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

// =============================================================================
// INVOICING TYPES (for future API implementation)
// =============================================================================

export interface Invoice {
  id: number
  invoice_number: string
  client_id: number
  client_name: string
  issue_date: string
  due_date: string
  total_amount: number
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled"
  items?: InvoiceItem[]
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

// =============================================================================
// SALES TYPES (for future API implementation)
// =============================================================================

export interface SalesOrder {
  id: number
  name: string
  customer_id: number
  customer_name: string
  order_date: string
  total_amount: number
  status: "draft" | "confirmed" | "processing" | "completed" | "cancelled"
  items?: SalesOrderItem[]
  created_at: string
  updated_at: string
}

export interface SalesOrderItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

// =============================================================================
// CREATE/UPDATE REQUEST TYPES
// =============================================================================

export interface CreateProductTemplateRequest {
  name: string
  type?: "storable" | "consumable" | "service"
  default_code?: string
  barcode?: string
  description?: string
  description_sale?: string
  description_purchase?: string
  category_id?: number
  brand_id?: number
  list_price: number
  standard_price?: number
  compare_price?: number
  uom_id: number
  uom_po_id?: number
  tracking?: "none" | "lot" | "serial"
  sale_ok?: boolean
  purchase_ok?: boolean
  is_published?: boolean
  weight?: number
  volume?: number
  hs_code?: string
  min_stock_qty?: number
  max_stock_qty?: number
  invoice_policy?: "order" | "delivery"
  taxes_id?: number[]
  supplier_taxes_id?: number[]
  image_url?: string
  image_urls?: string[]
  active?: boolean
  company_id?: number
}

export interface UpdateProductTemplateRequest {
  name?: string
  type?: "storable" | "consumable" | "service"
  default_code?: string
  barcode?: string
  description?: string
  category_id?: number
  brand_id?: number
  list_price?: number
  standard_price?: number
  uom_id?: number
  active?: boolean
  image_url?: string
}

export interface CreateCategoryRequest {
  name: string
  code?: string
  parent_id?: number
  description?: string
  image_url?: string
  sequence?: number
  active?: boolean
  company_id?: number
}

export interface CreateBrandRequest {
  name: string
  code?: string
  description?: string
  logo_url?: string
  website?: string
  active?: boolean
}

export interface InventoryAdjustmentRequest {
  product_id: number
  location_id: number
  lot_id?: number
  new_qty: number
  reason: string
}

