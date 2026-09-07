import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Compass, 
  Activity, 
  Radio, 
  Anchor, 
  MapPin, 
  Package, 
  DollarSign, 
  AlertTriangle,
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  Thermometer,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { INITIAL_SHIPMENTS, INITIAL_ALERTS } from './data/mockShipments';
import { 
  Shipment, 
  GeopoliticalAlert, 
  EmergencyProcurementOrder, 
  CryptographicAuthorization, 
  UserOfficer,
  DEFAULT_OFFICER
} from './types';
import { Header } from './components/Header';
import { ThreatTicker } from './components/ThreatTicker';
import { CustomerComfortGauge } from './components/CustomerComfortGauge';
import { TariffWidget } from './components/TariffWidget';
import { TriFactorMatrix } from './components/TriFactorMatrix';
import { CaptainsLogCard } from './components/CaptainsLogCard';
import { TacticalMap } from './components/TacticalMap';
import { EmergencyProcurementModal } from './components/EmergencyProcurementModal';
import { AuthorizeRerouteModal } from './components/AuthorizeRerouteModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { LoginScreen } from './components/LoginScreen';
import { SecurityProfileModal } from './components/SecurityProfileModal';

export default function App() {
  // Authentication State - Pre-initialized with valid session for instant seamless entry
  const [currentUser, setCurrentUser] = useState<UserOfficer | null>(() => {
    try {
      const savedUser = localStorage.getItem('resilientroute_auth_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // ignore
    }
    return DEFAULT_OFFICER;
  });
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('resilientroute_auth_token') || 'RR-DEFCON1-ACTIVE-SESSION-DEFAULT';
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(false);
  const [isSecurityProfileOpen, setIsSecurityProfileOpen] = useState<boolean>(false);

  // Shipments & Alerts
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('SHIP-01');
  const [alerts, setAlerts] = useState<GeopoliticalAlert[]>(INITIAL_ALERTS);

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isEmergencyProcurementOpen, setIsEmergencyProcurementOpen] = useState<boolean>(false);
  const [isAuthorizeOpen, setIsAuthorizeOpen] = useState<boolean>(false);

  // Verify saved token on initial load
  useEffect(() => {
    const verifyExistingSession = async () => {
      try {
        const savedToken = localStorage.getItem('resilientroute_auth_token');
        if (!savedToken) {
          setIsCheckingAuth(false);
          return;
        }

        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`,
          },
          body: JSON.stringify({ token: savedToken }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setAuthToken(savedToken);
          } else {
            localStorage.removeItem('resilientroute_auth_token');
            localStorage.removeItem('resilientroute_auth_user');
          }
        } else {
          localStorage.removeItem('resilientroute_auth_token');
        }
      } catch (e) {
        console.warn('Session verification fallback to login:', e);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyExistingSession();
  }, []);

  // Handle successful login
  const handleLoginSuccess = (user: UserOfficer, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
  };

  // Handle logout / terminal lock
  const handleLogout = async () => {
    try {
      if (authToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ token: authToken }),
        });
      }
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem('resilientroute_auth_token');
      localStorage.removeItem('resilientroute_auth_user');
      setCurrentUser(null);
      setAuthToken(null);
      setIsSecurityProfileOpen(false);
    }
  };

  // Current active shipment
  const activeShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  // Active plan for calculations
  const activePlanKey = activeShipment.selectedPlanKey;
  const activePlan = activeShipment.plans[
    activePlanKey === 'Plan A' ? 'planA' : activePlanKey === 'Plan B' ? 'planB' : 'planC'
  ];

  // Handler: Change active shipment
  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipmentId(shipment.id);
  };

  // Handler: Switch scenario plan (Plan A / Plan B / Plan C)
  const handleSelectPlan = (planKey: 'Plan A' | 'Plan B' | 'Plan C') => {
    setShipments(prev =>
      prev.map(s => (s.id === activeShipment.id ? { ...s, selectedPlanKey: planKey } : s))
    );
  };

  // Handler: Add Captain Log Entry
  const handleAddLogEntry = (text: string, level: 'INFO' | 'WARN' | 'DANGER') => {
    const newEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' UTC',
      category: 'TELEMETRY' as const,
      level,
      text,
    };

    setShipments(prev =>
      prev.map(s =>
        s.id === activeShipment.id
          ? { ...s, captainsLogs: [newEntry, ...s.captainsLogs] }
          : s
      )
    );
  };

  // Handler: Confirm Emergency Procurement
  const handleConfirmProcurement = (order: EmergencyProcurementOrder) => {
    setShipments(prev =>
      prev.map(s =>
        s.id === activeShipment.id
          ? { ...s, emergencySourcingTriggered: true, emergencyOrderDetails: order }
          : s
      )
    );
  };

  // Handler: Confirm Cryptographic Authorization
  const handleConfirmAuthorization = (authRecord: CryptographicAuthorization) => {
    setShipments(prev =>
      prev.map(s =>
        s.id === activeShipment.id
          ? { ...s, rerouteAuthorized: true, authRecord }
          : s
      )
    );
  };

  // If validating existing session token
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-950/50 animate-pulse">
            <Compass className="w-7 h-7 text-cyan-400 animate-spin" />
          </div>
          <div className="text-center font-mono space-y-1">
            <h2 className="text-sm font-bold text-white tracking-wider">RESILIENTROUTE AI COMMAND GATEWAY</h2>
            <p className="text-xs text-cyan-400/80">VERIFYING HARDWARE-LEVEL DEFENSE SESSION CREDENTIALS...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, render defense-grade LoginScreen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans flex flex-col">
      {/* 1. Executive Navigation Bar */}
      <Header
        shipments={shipments}
        selectedShipment={activeShipment}
        onSelectShipment={handleSelectShipment}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenEmergencyProcurement={() => setIsEmergencyProcurementOpen(true)}
        onOpenAuthorize={() => setIsAuthorizeOpen(true)}
        currentUser={currentUser}
        onOpenSecurityProfile={() => setIsSecurityProfileOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Global News & Threat Ticker Ribbon */}
      <ThreatTicker alerts={alerts} />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
        
        {/* Vessel Threat Context Ribbon */}
        <section className="bg-[#0e1420] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Vessel Metadata & Voyage */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Anchor className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white tracking-wide">
                      {activeShipment.vesselName}
                    </h2>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({activeShipment.imo} • Flag: {activeShipment.flag})
                    </span>
                  </div>
                  <span className="text-xs text-cyan-300 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {activeShipment.origin.city} ({activeShipment.origin.country}) → {activeShipment.destination.city} ({activeShipment.destination.country})
                  </span>
                </div>
              </div>

              {/* Cargo Details */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Cargo & Value Exposure
                </span>
                <span className="font-semibold text-slate-200">
                  {activeShipment.cargo}
                </span>
                <span className="font-mono text-emerald-400 font-bold ml-2">
                  (${ (activeShipment.cargoValueUSD / 1000000).toFixed(2) }M)
                </span>
              </div>
            </div>

            {/* Current Geopolitical Threat Callout */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 text-xs ${
                activeShipment.riskSeverity === 'CRITICAL'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              }`}>
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse flex-shrink-0" />
                <div>
                  <span className="font-bold text-[10px] uppercase tracking-wider block">
                    CURRENT GEOPOLITICAL ADVISORY:
                  </span>
                  <span className="text-[11px] font-medium leading-tight line-clamp-1 max-w-lg">
                    {activeShipment.currentThreat}
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              {activeShipment.rerouteAuthorized ? (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Reroute Cryptographically Authorized</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Action Required: Sign-off Pending</span>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Tactical Command Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT 7 COLUMNS: Interactive Tactical Map + Tri-Factor Decision Matrix */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Tactical Map with Corridor Overlay */}
            <TacticalMap
              shipment={activeShipment}
              selectedPlanKey={activePlanKey}
              onSelectPlan={handleSelectPlan}
            />

            {/* Tri-Factor Decision Matrix Benchmark Table */}
            <TriFactorMatrix
              plans={activeShipment.plans}
              selectedPlanKey={activePlanKey}
              onSelectPlan={handleSelectPlan}
            />

          </div>

          {/* RIGHT 5 COLUMNS: CCP Radial Gauge + Tax & Tariff Arbitrage + Captain's Log */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Customer Comfort Gauge (CCP) */}
            <CustomerComfortGauge
              plan={activePlan}
              coldChain={activeShipment.coldChain}
            />

            {/* Tax & Tariff Comparison Widget */}
            <TariffWidget
              tariffData={activeShipment.tariffData}
            />

            {/* Captain's Resource & Telemetry Log */}
            <CaptainsLogCard
              shipment={activeShipment}
              onAddLogEntry={handleAddLogEntry}
            />

          </div>

        </div>

      </main>

      {/* Footer System Status Bar */}
      <footer className="bg-[#0B0F17] border-t border-slate-800/80 mt-auto py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Autonomous Intelligence Engine Active
            </span>
            <span>•</span>
            <span>Naval SAT-AIS 10Hz Feed</span>
            <span>•</span>
            <span>UN/WTO Tariff Tariff Database v2026.9</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Blockchain Height: #894,120</span>
            <span>•</span>
            <span className="text-cyan-400">ResilientRoute AI v4.8</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EmergencyProcurementModal
        shipment={activeShipment}
        isOpen={isEmergencyProcurementOpen}
        onClose={() => setIsEmergencyProcurementOpen(false)}
        onConfirmProcurement={handleConfirmProcurement}
      />

      <AuthorizeRerouteModal
        shipment={activeShipment}
        isOpen={isAuthorizeOpen}
        onClose={() => setIsAuthorizeOpen(false)}
        onConfirmAuthorization={handleConfirmAuthorization}
      />

      <ExecutiveReportModal
        shipment={activeShipment}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {currentUser && (
        <SecurityProfileModal
          user={currentUser}
          token={authToken || undefined}
          isOpen={isSecurityProfileOpen}
          onClose={() => setIsSecurityProfileOpen(false)}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}
