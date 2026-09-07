export type RiskSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type AlertCategory = 'CONFLICT' | 'TARIFF_POLICY' | 'PORT_STRIKE' | 'CHOKEPOINT';

export interface GeopoliticalAlert {
  id: string;
  headline: string;
  category: AlertCategory;
  severity: RiskSeverity;
  region: string;
  delayImpact: string;
  timestamp: string;
  verifiedAgency: string;
  coordinates: [number, number]; // [lat, lng]
  summary: string;
  relatedShipmentId?: string;
}

export interface TriFactorPlan {
  planKey: 'Plan A' | 'Plan B' | 'Plan C';
  title: string;
  subtitle: string;
  modalType: 'Status Quo' | 'Maritime Detour' | 'Multimodal Air/Rail';
  safetyIndex: number; // 0 - 100%
  netProfitDeltaPercent: number; // e.g. -42.8%, +4.2%, +14.8%
  ccpPercentile: number; // 0 - 100th percentile
  etaDaysDelta: number; // days (+12, -2, etc)
  totalTransitDays: number;
  bunkerFuelCostUSD: number;
  demurrageCostUSD: number;
  tariffCustomsUSD: number;
  freightAirRailUSD: number;
  totalCostUSD: number;
  carbonTons: number;
  keyRisks: string[];
  keyBenefits: string[];
  recommended: boolean;
}

export interface TariffComparisonData {
  baselinePort: string;
  candidatePortA: string;
  candidatePortB: string;
  entryTariffRateBaseline: number; // %
  entryTariffRateA: number;
  entryTariffRateB: number;
  customsClearanceBaselineUSD: number;
  customsClearanceAUSD: number;
  customsClearanceBUSD: number;
  demurragePer24hBaselineUSD: number;
  demurragePer24hAUSD: number;
  demurragePer24hBUSD: number;
  ftzSavingsUSDA: number;
  ftzSavingsUSDB: number;
  totalFinancialExposureBaseline: number;
  totalFinancialExposureA: number;
  totalFinancialExposureB: number;
  summaryNote: string;
}

export interface ColdChainTelemetry {
  required: boolean;
  targetTempC: number;
  minTempC: number;
  maxTempC: number;
  currentTempC: number;
  ambientTempC: number;
  status: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  spoilageRiskUSD: number;
  shorePowerReady: boolean;
  backupGeneratorOnline: boolean;
  batteryReserveHours: number;
  tempHistory: Array<{ time: string; temp: number; ambient: number }>;
}

export interface CaptainsLogEntry {
  id: string;
  timestamp: string;
  category: 'TELEMETRY' | 'REEFER_ALERT' | 'NAVAL_SECURITY' | 'WEATHER' | 'CREW';
  level: 'INFO' | 'WARN' | 'DANGER';
  text: string;
}

export interface SMSDispatchRecord {
  recipient: string;
  phone: string;
  timestamp: string;
  message: string;
}

export interface EmergencyProcurementOrder {
  orderId: string;
  trackingNumber: string;
  status: 'ORDERED' | 'DISPATCHED' | 'EN_ROUTE' | 'DELIVERED';
  targetHospital: string;
  item: string;
  unitsSupplied: number;
  sourceDepot: string;
  estimatedArrivalHours: number;
  carrier: string;
  coldChainTempRange: string;
  smsLogs: SMSDispatchRecord[];
  timestamp: string;
}

export interface CryptographicAuthorization {
  signatureHash: string;
  blockHeight: number;
  signerRole: string;
  signerName: string;
  timestamp: string;
  planSelected: string;
  vesselName: string;
  blockchainStatus: string;
}

export interface Shipment {
  id: string;
  vesselName: string;
  imo: string;
  flag: string;
  cargo: string;
  cargoCategory: 'Critical Pharma & Medical' | 'High-Tech Semiconductors' | 'EV & Clean Energy' | 'Emergency Food & Supplies';
  cargoValueUSD: number;
  origin: {
    port: string;
    city: string;
    country: string;
    coords: [number, number]; // [lat, lng]
  };
  destination: {
    port: string;
    city: string;
    country: string;
    coords: [number, number];
  };
  currentCoords: [number, number];
  speedKnots: number;
  heading: number;
  bunkerFuelPercent: number;
  freshWaterPercent: number;
  crewProvisionsDays: number;
  chokepointRisk: string;
  currentThreat: string;
  riskSeverity: RiskSeverity;
  coldChain: ColdChainTelemetry;
  plans: {
    planA: TriFactorPlan;
    planB: TriFactorPlan;
    planC: TriFactorPlan;
  };
  tariffData: TariffComparisonData;
  captainsLogs: CaptainsLogEntry[];
  selectedPlanKey: 'Plan A' | 'Plan B' | 'Plan C';
  rerouteAuthorized: boolean;
  emergencySourcingTriggered: boolean;
  emergencyOrderDetails?: EmergencyProcurementOrder;
  authRecord?: CryptographicAuthorization;
}

export interface UserOfficer {
  id: string; // User ID / Email
  officerId: string; // Tactical ID, e.g. 'KAMALESH-OPS-01'
  name: string; // 'Commander Kamalesh'
  email: string; // 'kamaleshkk001@gmail.com'
  role: string; // 'Director of Global Supply Security'
  clearanceLevel: 'DEFCON 1 (TOP SECRET)' | 'DEFCON 2 (SECRET)' | 'DEFCON 3 (CONFIDENTIAL)';
  department: string; // 'Intermodal Tactical Operations & Chokepoint Defense'
  assignedJurisdictions: string[];
  lastLogin: string;
  sessionToken?: string;
  avatarUrl?: string;
}

export interface AuthAuditLog {
  timestamp: string;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'SESSION_VERIFIED' | 'LOGOUT' | 'SECURITY_CHALLENGE';
  ipAddress: string;
  cipher: string;
  clearanceGranted: string;
  deviceFingerprint: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserOfficer;
  token?: string;
  expiresAt?: string;
  message?: string;
  securityAudit?: AuthAuditLog;
}
