/**
 * Service Course - Bike inventory, geometry, and fit management
 */

// ============================================================================
// ENUMS / TYPE UNIONS
// ============================================================================

export type BikeType = 'road' | 'gravel' | 'mountain' | 'time_trial' | 'track' | 'cyclocross' | 'hybrid' | 'ebike' | 'other';
export type FrameMaterial = 'carbon' | 'aluminum' | 'steel' | 'titanium' | 'other';
export type DrivetrainType = '1x' | '2x' | '3x';
export type ElectronicShifting = 'none' | 'sram_axs' | 'shimano_di2' | 'campagnolo_eps' | 'other';
export type PedalType = 'spd' | 'spd_sl' | 'look' | 'speedplay' | 'time' | 'flat' | 'other';
export type TireType = 'clincher' | 'tubeless' | 'tubular';
export type FitType = 'professional' | 'self' | 'calculated';
export type Flexibility = 'limited' | 'average' | 'good' | 'excellent';
export type RidingStyle = 'recreational' | 'fitness' | 'performance' | 'racing';
export type GeometrySource = 'manual' | 'geometry_geeks';

// ============================================================================
// BIKE - Main bike entity
// ============================================================================

export interface Bike {
  id: string;
  userId: string;
  name: string;
  bikeType: BikeType;
  brand: string | null;
  model: string | null;
  year: number | null;
  frameSize: string | null;
  frameMaterial: FrameMaterial | null;
  color: string | null;
  weightKg: number | null;
  photoUrl: string | null;
  isDefault: boolean;
  isActive: boolean;
  purchaseDate: string | null;
  purchasePrice: number | null;
  geometryGeeksUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BikeInput {
  name: string;
  bikeType: BikeType;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  frameSize?: string | null;
  frameMaterial?: FrameMaterial | null;
  color?: string | null;
  weightKg?: number | null;
  photoUrl?: string | null;
  isDefault?: boolean;
  isActive?: boolean;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  geometryGeeksUrl?: string | null;
}

// ============================================================================
// BIKE GEOMETRY - Frame measurements
// ============================================================================

export interface BikeGeometry {
  id: string;
  bikeId: string;
  // Primary fit numbers
  stackMm: number | null;
  reachMm: number | null;
  // Frame tubes
  seatTubeLengthMm: number | null;
  seatTubeAngle: number | null;
  effectiveTopTubeMm: number | null;
  headTubeLengthMm: number | null;
  headTubeAngle: number | null;
  // Fork
  forkRakeMm: number | null;
  forkAxleToCrownMm: number | null;
  trailMm: number | null;
  // Rear triangle
  chainstayLengthMm: number | null;
  wheelbaseMm: number | null;
  bbDropMm: number | null;
  bbHeightMm: number | null;
  standoverHeightMm: number | null;
  // Import metadata
  source: GeometrySource;
  importedAt: string | null;
}

export interface BikeGeometryInput {
  stackMm?: number | null;
  reachMm?: number | null;
  seatTubeLengthMm?: number | null;
  seatTubeAngle?: number | null;
  effectiveTopTubeMm?: number | null;
  headTubeLengthMm?: number | null;
  headTubeAngle?: number | null;
  forkRakeMm?: number | null;
  forkAxleToCrownMm?: number | null;
  trailMm?: number | null;
  chainstayLengthMm?: number | null;
  wheelbaseMm?: number | null;
  bbDropMm?: number | null;
  bbHeightMm?: number | null;
  standoverHeightMm?: number | null;
  source?: GeometrySource;
}

// ============================================================================
// BIKE FIT POSITION - Current fit setup
// ============================================================================

export interface BikeFitPosition {
  id: string;
  bikeId: string;
  // Saddle
  saddleHeightMm: number | null;
  saddleSetbackMm: number | null;
  saddleForeAftMm: number | null;
  saddleTiltDegrees: number | null;
  saddleBrand: string | null;
  saddleModel: string | null;
  // Handlebars
  handlebarReachMm: number | null;
  handlebarDropMm: number | null;
  handlebarWidthMm: number | null;
  handlebarBrand: string | null;
  handlebarModel: string | null;
  // Stem
  stemLengthMm: number | null;
  stemAngleDegrees: number | null;
  spacerStackMm: number | null;
  // Cleats
  cleatForeAftMm: number | null;
  cleatRotationDegrees: number | null;
  cleatLateralMm: number | null;
  // Calculated angles
  kneeAngleDegrees: number | null;
  hipAngleDegrees: number | null;
  backAngleDegrees: number | null;
  // Fit metadata
  fitDate: string | null;
  fitType: FitType | null;
  fitNotes: string | null;
  fitterName: string | null;
}

export interface BikeFitPositionInput {
  saddleHeightMm?: number | null;
  saddleSetbackMm?: number | null;
  saddleForeAftMm?: number | null;
  saddleTiltDegrees?: number | null;
  saddleBrand?: string | null;
  saddleModel?: string | null;
  handlebarReachMm?: number | null;
  handlebarDropMm?: number | null;
  handlebarWidthMm?: number | null;
  handlebarBrand?: string | null;
  handlebarModel?: string | null;
  stemLengthMm?: number | null;
  stemAngleDegrees?: number | null;
  spacerStackMm?: number | null;
  cleatForeAftMm?: number | null;
  cleatRotationDegrees?: number | null;
  cleatLateralMm?: number | null;
  kneeAngleDegrees?: number | null;
  hipAngleDegrees?: number | null;
  backAngleDegrees?: number | null;
  fitDate?: string | null;
  fitType?: FitType | null;
  fitNotes?: string | null;
  fitterName?: string | null;
}

// ============================================================================
// BIKE DRIVETRAIN - Gearing configuration
// ============================================================================

export interface BikeDrivetrain {
  id: string;
  bikeId: string;
  drivetrainType: DrivetrainType;
  groupsetBrand: string | null;
  groupsetModel: string | null;
  electronicShifting: ElectronicShifting;
  // Chainrings
  chainring1: number | null;
  chainring2: number | null;
  chainring3: number | null;
  // Cassette
  cassetteSpeeds: number | null;
  cassetteTeeth: number[] | null;
  // Crank
  crankLengthMm: number | null;
  crankBrand: string | null;
  crankModel: string | null;
  // Pedals
  pedalType: PedalType | null;
  pedalBrand: string | null;
  pedalModel: string | null;
}

export interface BikeDrivetrainInput {
  drivetrainType: DrivetrainType;
  groupsetBrand?: string | null;
  groupsetModel?: string | null;
  electronicShifting?: ElectronicShifting;
  chainring1?: number | null;
  chainring2?: number | null;
  chainring3?: number | null;
  cassetteSpeeds?: number | null;
  cassetteTeeth?: number[] | null;
  crankLengthMm?: number | null;
  crankBrand?: string | null;
  crankModel?: string | null;
  pedalType?: PedalType | null;
  pedalBrand?: string | null;
  pedalModel?: string | null;
}

// ============================================================================
// BIKE TIRES - Tire setup
// ============================================================================

export interface BikeTire {
  id: string;
  bikeId: string;
  position: 'front' | 'rear';
  brand: string;
  model: string;
  widthMm: number;
  tireType: TireType | null;
  // Performance specs (from BicycleRollingResistance)
  rollingResistanceWatts: number | null;
  weightGrams: number | null;
  punctureResistance: number | null;
  // Pressure
  currentPressurePsi: number | null;
  recommendedPressurePsi: number | null;
  // Tracking
  installDate: string | null;
  installDistanceKm: number | null;
  // External reference
  brrUrl: string | null;
}

export interface BikeTireInput {
  position: 'front' | 'rear';
  brand: string;
  model: string;
  widthMm: number;
  tireType?: TireType | null;
  rollingResistanceWatts?: number | null;
  weightGrams?: number | null;
  punctureResistance?: number | null;
  currentPressurePsi?: number | null;
  recommendedPressurePsi?: number | null;
  installDate?: string | null;
  installDistanceKm?: number | null;
  brrUrl?: string | null;
}

// ============================================================================
// ZINN MEASUREMENTS - Body measurements for fit calculation
// ============================================================================

export interface ZinnMeasurements {
  id: string;
  userId: string;
  inseamMm: number;
  statureHeightMm: number | null;
  trunkLengthMm: number | null;
  armLengthMm: number | null;
  shoulderWidthMm: number | null;
  footLengthMm: number | null;
  flexibility: Flexibility | null;
  ridingStyle: RidingStyle | null;
}

export interface ZinnMeasurementsInput {
  inseamMm: number;
  statureHeightMm?: number | null;
  trunkLengthMm?: number | null;
  armLengthMm?: number | null;
  shoulderWidthMm?: number | null;
  footLengthMm?: number | null;
  flexibility?: Flexibility | null;
  ridingStyle?: RidingStyle | null;
}

// ============================================================================
// DISPLAY CONSTANTS
// ============================================================================

export const BIKE_TYPE_LABELS: Record<BikeType, string> = {
  road: 'Road',
  gravel: 'Gravel',
  mountain: 'Mountain',
  time_trial: 'Time Trial',
  track: 'Track',
  cyclocross: 'Cyclocross',
  hybrid: 'Hybrid',
  ebike: 'E-Bike',
  other: 'Other',
};

export const FRAME_MATERIAL_LABELS: Record<FrameMaterial, string> = {
  carbon: 'Carbon',
  aluminum: 'Aluminum',
  steel: 'Steel',
  titanium: 'Titanium',
  other: 'Other',
};

export const DRIVETRAIN_TYPE_LABELS: Record<DrivetrainType, string> = {
  '1x': '1x',
  '2x': '2x',
  '3x': '3x',
};

export const ELECTRONIC_SHIFTING_LABELS: Record<ElectronicShifting, string> = {
  none: 'Mechanical',
  sram_axs: 'SRAM AXS',
  shimano_di2: 'Shimano Di2',
  campagnolo_eps: 'Campagnolo EPS',
  other: 'Other Electronic',
};

export const PEDAL_TYPE_LABELS: Record<PedalType, string> = {
  spd: 'Shimano SPD',
  spd_sl: 'Shimano SPD-SL',
  look: 'Look',
  speedplay: 'Speedplay',
  time: 'Time',
  flat: 'Flat',
  other: 'Other',
};

export const TIRE_TYPE_LABELS: Record<TireType, string> = {
  clincher: 'Clincher',
  tubeless: 'Tubeless',
  tubular: 'Tubular',
};

export const FLEXIBILITY_LABELS: Record<Flexibility, string> = {
  limited: 'Limited',
  average: 'Average',
  good: 'Good',
  excellent: 'Excellent',
};

export const RIDING_STYLE_LABELS: Record<RidingStyle, string> = {
  recreational: 'Recreational',
  fitness: 'Fitness',
  performance: 'Performance',
  racing: 'Racing',
};

// ============================================================================
// COMMON GROUPSETS
// ============================================================================

export const COMMON_GROUPSETS = [
  // Shimano Road
  { brand: 'Shimano', model: 'Dura-Ace R9200', electronic: 'shimano_di2' as const },
  { brand: 'Shimano', model: 'Dura-Ace R9100', electronic: 'shimano_di2' as const },
  { brand: 'Shimano', model: 'Ultegra R8100', electronic: 'shimano_di2' as const },
  { brand: 'Shimano', model: 'Ultegra R8000', electronic: 'none' as const },
  { brand: 'Shimano', model: '105 R7100', electronic: 'shimano_di2' as const },
  { brand: 'Shimano', model: '105 R7000', electronic: 'none' as const },
  { brand: 'Shimano', model: 'Tiagra', electronic: 'none' as const },
  { brand: 'Shimano', model: 'Sora', electronic: 'none' as const },
  // SRAM Road
  { brand: 'SRAM', model: 'Red AXS', electronic: 'sram_axs' as const },
  { brand: 'SRAM', model: 'Force AXS', electronic: 'sram_axs' as const },
  { brand: 'SRAM', model: 'Rival AXS', electronic: 'sram_axs' as const },
  { brand: 'SRAM', model: 'Apex AXS', electronic: 'sram_axs' as const },
  { brand: 'SRAM', model: 'Red eTap', electronic: 'sram_axs' as const },
  { brand: 'SRAM', model: 'Force', electronic: 'none' as const },
  { brand: 'SRAM', model: 'Rival', electronic: 'none' as const },
  // Campagnolo
  { brand: 'Campagnolo', model: 'Super Record EPS', electronic: 'campagnolo_eps' as const },
  { brand: 'Campagnolo', model: 'Record EPS', electronic: 'campagnolo_eps' as const },
  { brand: 'Campagnolo', model: 'Chorus EPS', electronic: 'campagnolo_eps' as const },
  { brand: 'Campagnolo', model: 'Super Record', electronic: 'none' as const },
  { brand: 'Campagnolo', model: 'Record', electronic: 'none' as const },
  { brand: 'Campagnolo', model: 'Chorus', electronic: 'none' as const },
  { brand: 'Campagnolo', model: 'Centaur', electronic: 'none' as const },
  // Shimano MTB
  { brand: 'Shimano', model: 'XTR M9100', electronic: 'none' as const },
  { brand: 'Shimano', model: 'XT M8100', electronic: 'none' as const },
  { brand: 'Shimano', model: 'SLX M7100', electronic: 'none' as const },
  { brand: 'Shimano', model: 'Deore M6100', electronic: 'none' as const },
  // SRAM MTB
  { brand: 'SRAM', model: 'XX1 Eagle AXS', electronic: 'sram_axs' as const },
  { brand: 'SRAM', model: 'X01 Eagle AXS', electronic: 'sram_axs' as const },
  { brand: 'SRAM', model: 'GX Eagle AXS', electronic: 'sram_axs' as const },
  { brand: 'SRAM', model: 'XX1 Eagle', electronic: 'none' as const },
  { brand: 'SRAM', model: 'X01 Eagle', electronic: 'none' as const },
  { brand: 'SRAM', model: 'GX Eagle', electronic: 'none' as const },
  { brand: 'SRAM', model: 'NX Eagle', electronic: 'none' as const },
];

// ============================================================================
// COMMON CASSETTES
// ============================================================================

export const COMMON_CASSETTES: { speeds: number; teeth: number[]; label: string }[] = [
  // 12-speed
  { speeds: 12, teeth: [10,10,12,13,14,15,17,19,21,24,28,33], label: '10-33 (12s)' },
  { speeds: 12, teeth: [10,11,12,13,14,15,17,19,21,24,28,34], label: '10-34 (12s)' },
  { speeds: 12, teeth: [11,12,13,14,15,16,17,19,21,24,28,32], label: '11-32 (12s)' },
  { speeds: 12, teeth: [11,12,13,14,15,17,19,21,24,27,30,34], label: '11-34 (12s)' },
  // 11-speed
  { speeds: 11, teeth: [11,12,13,14,15,17,19,21,23,25,28], label: '11-28 (11s)' },
  { speeds: 11, teeth: [11,12,13,14,15,17,19,21,24,28,32], label: '11-32 (11s)' },
  { speeds: 11, teeth: [11,12,13,14,16,18,20,22,25,28,32], label: '11-32 (11s compact)' },
  { speeds: 11, teeth: [11,12,13,14,15,17,19,22,25,28,34], label: '11-34 (11s)' },
  // 10-speed
  { speeds: 10, teeth: [11,12,13,14,15,17,19,21,24,28], label: '11-28 (10s)' },
  { speeds: 10, teeth: [11,12,14,16,18,20,22,25,28,32], label: '11-32 (10s)' },
];
