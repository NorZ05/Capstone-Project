import React, { useState, useEffect } from "react";
import svc from './services/productsService';
import { FaTrash, FaMinus, FaPlus, FaSearch } from "react-icons/fa";
import AcetyleneImg from "./Products/AcetyleneImg.jpg";
import AcylicImg from "./Products/AcrylicThinnerImg.jpg";
import AlSilverGallonImg from "./Products/ALSilverGallonImg.jpg";
import AlSilverLiterImg from "./Products/ALSilverLiterImg.jpg";
import AmazonScreenMeterImg from "./Products/AmazonScreenImg2x4Meter.jpg";
import AmazonScreenRollImg from "./Products/AmazonScreenImg2x4Roll.jpg";
import SealguardImg from "./Products/Sealguard.jpg";  
import AsalumG26Img from "./Products/AsalumG26.jpg";
import AsalumG24Img from "./Products/AsalumG24.jpg";
import AsphaltImg from "./Products/Asphalt.jpg";
import BarbedWireLImg from "./Products/BarbedWire.jpg";
import BarbedWireMImg from "./Products/BarbedWireM.jpg";
import BarbedWireSImg from "./Products/BarbedWireS.jpg";
import MSPlateImg from "./Products/MsPlate.jpg";
import BoysenRedLatexImg from "./Products/BoysenRedLatex.jpg";
import BrushingReducerImg from "./Products/BrushingReducer.jpg";
import BrushingReducer423Img from "./Products/BrushingReducer423.jpg";
import BoysenBurntShiennaImg from "./Products/BoysenBurntShienna.jpg";
import Boysen from "./Products/Boysen.jpg";
import CementBondImg from "./Products/CementBondGallon.jpg";
import ChainBlockImg from "./Products/ChainBlock.jpg";
import ChainImg from "./Products/Chain.jpg";
import ChemicalHoseImg from "./Products/ChemicalHose.jpg";
import EpoxyInjectableImg from "./Products/EpoxyCrackInjectable.jpg";
import EpoxyHighViscosityImg from "./Products/EpoxyHighViscosity.jpg";
import ConcreteNailsImg from "./Products/ConcreteNails.jpg";
import CuringCompoundDrumImg from "./Products/CuringCompoundDrum.jpg";
import CuringCompoundGallonImg from "./Products/CuringCompoundGallon.jpg";
import CutOffBladeImg from "./Products/CutOffBlade.jpg";
import CutoffBladeTyrolitImg from "./Products/CutoffBladeTyrolit.jpg";
import CutBladeMetroImg from "./Products/CutBladeMetro.jpg";
import CutBladeYestar from "./Products/CutBladeYestar.jpg";
import CycloneWireImg from "./Products/CycloneWire.jpg";
import DelawareAutomotiveLacquerImg from "./Products/DelawareAutomotiveLacquer.jpg";
import DrawerGuideImg from "./Products/DrawerGuide.jpg";
import DuctHoseImg from "./Products/DuctHose.jpg";
import DurapatchImg from "./Products/Durapatch.jpg";
import DuratexImg from "./Products/Duratex.jpg";
import EmulsionGallonImg from "./Products/EmulsionGallon.jpg";
import EPrimerImg from "./Products/EPrimer.jpg";
import MINISOTAImg from "./Products/MINISOTA.jpg";
import PureCoatImg from "./Products/PureCoat.jpg";
import FinishingNailsImg from "./Products/FinishingNails.jpg";
import FlatHeadNailsImg from "./Products/FlatHeadNails.jpeg";
import FlexibleHoseImg from "./Products/FlexibleHose.jpg";
import FushBowlImg from "./Products/FlushBowl.jpg";
import FolyaSheetImg from "./Products/FolyaSheet.jpg";
import FrenchImg from "./Products/French.jpg";
import FWE from "./Products/FWE.jpg";
import G from "./Products/G.jpg";
import GardenHose from "./Products/GardenHose.jpg";
import GasketMaker from "./Products/GasketMaker.jpg";
import PurlinThin from "./Products/PurlinThin.jpg";
import PurlinThick from "./Products/PurlinThick.jpg";
import GIPlain from "./Products/GIPlain.jpg";
import TubularSteel from "./Products/TubularSteel.jpg";
import HSNails from "./Products/HSNails.jpg";
import Hinges from "./Products/Hinges.jpg";
import HogWire from "./Products/HogWire.jpg";
import IBar from "./Products/I-Bar.jpg";
import InsulatorFoam from "./Products/InsulatorFoam.jpg";
import JetmaticGasket from "./Products/JetmaticGasket.jpg";
import LampBlack from "./Products/LampBlack.jpg";
import LaquirThinner from "./Products/LaquirThinner.jpg";
import LevelHose from "./Products/LevelHose.jpg";
import MaskingTape from "./Products/MaskingTape.jpg";
import MightyBond from "./Products/Mightybond.jpg";
import MosquitoScreenMeter from "./Products/MosquitoScreenMeter.jpg";
import MosquitoScreenRoll from "./Products/MosquitoScreenRoll.jpg";
import MuriaticAcid from "./Products/MuriaticAcid.jpg";
import NonSagEpoxy from "./Products/Non-SagEpoxy.jpg";
import NylonBig from "./Products/NylonBig.jpg";
import NylonMeter from "./Products/NylonMeter.jpg";
import NylonSmall from "./Products/NylonSmall.jpg";
import AssortedColor from "./Products/AssortedColor.jpg"; // To Gerald *Some images do not match the Products
import AssortedColor2 from "./Products/AssortedColor2.jpg";
import Coupling from "./Products/Coupling.jpg";
import Elbow from "./Products/Elbow.png";
import female from "./Products/female.jpg";
import Latex from "./Products/Latex.jpg";
import Latex2 from "./Products/Latex2.jpg";
import male from "./Products/male.jpg";
import PHS from "./Products/PHS.jpg";
import PVC1 from "./Products/PVC1.jpg";
import PVC2 from "./Products/PVC2.jpg";
import PVCCoupling from "./Products/PVCCoupling.jpg";
import PVCElbow from "./Products/PVCElbow.jpg";
import PVCORANGE from "./Products/PVCORANGE.jpg";
import PVCTeeR from "./Products/PVCTeeR.jpg";
import plainbar from "./Products/plainbar.jpg";
import phenoboard1 from "./Products/phenoboard1.jpg";
import phenoboard2 from "./Products/phenoboard2.jpg";
import plywooddm from "./Products/plywooddm.jpg";
import plywoodds from "./Products/plywoodds.jpg";
import plywoodmarine from "./Products/plywoodmarine.jpg";
import plywoodordinary from "./Products/plywoodordinary.jpg";
import plywoodsfm from "./Products/plywoodsfm.jpg";
import plywoodsfo from "./Products/plywoodsfo.jpg";
import powerhose from "./Products/powerhose.jpg";
import ptraplav from "./Products/ptraplav.jpg";
import PacificCement40kg from "./Products/Cement40kg.jpg";
import PatchingCompound1kg from "./Products/PatchingCompound1kg.jpg";
import PatchingCompound1sack from "./Products/PatchingCompound1sack.jpg";
import PinLight from "./Products/PinLight.jpg";
import puttyknife from "./Products/puttyknife.jpg";
import Pulley from "./Products/Pulley.jpg";
import rubberwheel from "./Products/rubberwheel.jpg";
import RawShiena from "./Products/RawShiena.jpg";
import RedOxide from "./Products/RedOxide.jpg";
import RoofPaint from "./Products/RoofPaint.jpg";
import SDR11METER from "./Products/SDR11METER.jpg";
import SDR17METER from "./Products/SDR17METER.jpg";
import SDR17METER2 from "./Products/SDR17METER2.jpg";
import SDR17ROLL from "./Products/SDR17ROLL.jpg";
import SDR17ROLL2 from "./Products/SDR17ROLL2.jpg";
import SGAPAINT from "./Products/SGAPAINT.jpg";
import SILICONESEALANT from "./Products/SILICONESEALANT.jpg";
import smartboard from "./Products/smartboard.jpg";
import SOLIDGUARD from "./Products/SOLIDGUARD.jpg";
import SkimCoat from "./Products/SkimCoat.jpg";
import SpoleInsulator from "./Products/SpoleInsulator.jpg";
import StructuralSquareBar from "./Products/StructuralSquaredBars.jpg";
import SquareBar from "./Products/SquareBar.jpg";
import SuctionHose from "./Products/SuctionHose.jpg";
import SuctionHose2 from "./Products/SuctionHose2.jpg";
import TarpRoll from "./Products/TarpRoll.jpg";
import TBar from "./Products/TBar.jpg";
import Tee from "./Products/Tee.jpg";
import TieRoll from "./Products/TieRoll.jpg";
import TieKilo from "./Products/TieKilo.jpg";
import Tiebox from "./Products/Tiebox.jpg";
import TileAdhesive from "./Products/TileAdhesive.jpg";
import Tonner from "./Products/Tonner.jpg";
import Turnbuckle from "./Products/Turnbuckle.jpg";
import Unails from "./Products/Unails.jpg";
import UmbrellaNails from "./Products/UmbrellaNails.jpg";
import UmbrellaNailsCase from "./Products/UmbrellaNailsCase.jpg";
import weldedscreen from "./Products/weldedscreen.jpg";
import weldedscreenroll from "./Products/weldedscreenroll.jpg";
import WeldingLens from "./Products/WeldingLens.jpg";
import Weldingrod from "./Products/Weldingrod.jpg";
import Weldingrod2 from "./Products/Weldingrod2.jpg";
import Weldingrodbox from "./Products/Weldingrodbox.jpg";
import wirefastener from "./Products/wirefastener.jpg";
import wirenails from "./Products/wirenails.jpg";
import wirenails2 from "./Products/wirenails2.jpg";
import woodsaver from "./Products/WoodSaverGallon.jpg";
import woodsaver2 from "./Products/WoodSaverLiter.jpg";
import zbar from "./Products/zbar.jpg";
import PlaceholderImg from "./Assets/Empty.jpg";
import cfg from './config';

export let products = [
  { id: 1001, name: "Acetylenesssss/LPG Hose Meter", price: 50.00, category: "Hose & Tubing", img: AcetyleneImg },
  { id: 1002, name: "Acrylic Thinner 700ml", price: 540.00, category: "Paint & Primer", img: AcylicImg },
  { id: 1003, name: "AL Silver Gallon", price: 520.00, category: "Paint & Primer", img: AlSilverGallonImg },
  { id: 1004, name: "AL Silver Liter", price: 235.00, category: "Paint & Primer", img: AlSilverLiterImg },
  { id: 1005, name: "Amazon Screen 1/2x4 ft / Meter", price: 160.00, category: "Wire Mesh", img: AmazonScreenMeterImg },
  { id: 1006, name: "Amazon Screen 1/2x4 ft / Roll", price: 4800.00, category: "Wire Mesh", img: AmazonScreenRollImg },
  { id: 1007, name: "Amazon Screen 1/4x4 ft / Meter", price: 150.00, category: "Wire Mesh", img: AmazonScreenMeterImg },
  { id: 1008, name: "Amazon Screen 1/4x4 ft / Roll", price: 4500.00, category: "Wire Mesh", img: AmazonScreenRollImg },
  { id: 1009, name: "Amazon Screen 1x4 ft / Meter", price: 180.00, category: "Wire Mesh", img: AmazonScreenMeterImg },
  { id: 1010, name: "Amazon Screen 1x4 ft / Roll", price: 5400.00, category: "Wire Mesh", img: AmazonScreenRollImg },
  { id: 1011, name: "Amazon Screen 3/4x4 ft / Meter", price: 170.00, category: "Wire Mesh", img: AmazonScreenMeterImg },
  { id: 1012, name: "Amazon Screen 3/4x4 ft / Roll", price: 5100.00, category: "Wire Mesh", img: AmazonScreenRollImg },
  { id: 1013, name: "Apo Sanding Sealer Gallon", price: 615.00, category: "Paint & Primer", img: SealguardImg },
  { id: 1014, name: "ASALUM G24 10ft", price: 230.00, category: "Roofing", img: AsalumG24Img },
  { id: 1015, name: "ASALUM G24 12ft", price: 276.00, category: "Roofing", img: AsalumG24Img },
  { id: 1016, name: "ASALUM G24 6ft", price: 138.00, category: "Roofing", img: AsalumG24Img },
  { id: 1017, name: "ASALUM G24 7ft", price: 161.00, category: "Roofing", img: AsalumG24Img },
  { id: 1018, name: "ASALUM G24 8ft", price: 184.00, category: "Roofing", img: AsalumG24Img },
  { id: 1019, name: "ASALUM G24 9ft", price: 207.00, category: "Roofing", img: AsalumG24Img },
  { id: 1020, name: "ASALUM G24 Linear ft", price: 23.00, category: "Roofing", img: AsalumG24Img },
  { id: 1021, name: "ASALUM G26 10ft", price: 175.00, category: "Roofing", img: AsalumG26Img },
  { id: 1022, name: "ASALUM G26 12ft", price: 210.00, category: "Roofing", img: AsalumG26Img },
  { id: 1023, name: "ASALUM G26 6ft", price: 105.00, category: "Roofing", img: AsalumG26Img },
  { id: 1024, name: "ASALUM G26 8ft", price: 140.00, category: "Roofing", img: AsalumG26Img },
  { id: 1025, name: "ASALUM G26 9ft", price: 158.00, category: "Roofing", img: AsalumG26Img },
  { id: 1026, name: "ASALUM G26 Linear ft", price: 17.50, category: "Roofing", img: AsalumG26Img },
  { id: 1027, name: "Asphalt 1 Square Foot  ", price: 700.00, category: "Construction", img: AsphaltImg },
  { id: 1028, name: "Barbed Wire 25kg", price: 1600.00, category: "Wire Mesh", img: BarbedWireLImg }, 
  { id: 1029, name: "Barbed Wire 20kg", price: 1450.00, category: "Wire Mesh", img: BarbedWireMImg }, 
  { id: 1030, name: "Barbed Wire 15kg", price: 1350.00, category: "Wire Mesh", img: BarbedWireSImg }, 
  { id: 1031, name: "BI Sheet/MS Plate 10mm", price: 13590.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1032, name: "BI Sheet/MS Plate 12mm", price: 16900.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1033, name: "BI Sheet/MS Plate 16mm", price: 21450.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1034, name: "BI Sheet/MS Plate 2mm", price: 2500.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1035, name: "BI Sheet/MS Plate 3mm", price: 3500.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1036, name: "BI Sheet/MS Plate 4mm", price: 4500.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1037, name: "BI Sheet/MS Plate 5mm", price: 5950.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1038, name: "BI Sheet/MS Plate 6mm", price: 7500.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1039, name: "BI Sheet/MS Plate 8mm", price: 11500.00, category: "Sheet Metals", img: MSPlateImg },
  { id: 1040, name: "Boysen -Red 250ml Latex", price: 85.00, category: "Paint & Primer", img: BoysenRedLatexImg },
  { id: 1041, name: "Boysen -Red 250ml Oil", price: 135.00, category: "Paint & Primer", img: BoysenRedLatexImg },
  { id: 1042, name: "Brushing Reducer 3x2", price: 35.00, category: "Plumbing Fitting", img: BrushingReducerImg },
  { id: 1043, name: "Brushing Reducer 4x2,3", price: 65.00, category: "Plumbing Fitting", img: BrushingReducer423Img },
  { id: 1044, name: "Boysen Burnt Shienna 250ml Latex", price: 85.00, category: "Paint & Primer", img: BoysenBurntShiennaImg},
  { id: 1045, name: "Boysen Burnt Shienna 250ml Oil", price: 135.00, category: "Paint & Primer", img: BoysenBurntShiennaImg},
  { id: 1046, name: "Boysen Burnt Umber 250ml Latex", price: 85.00, category: "Paint & Primer", img: Boysen },
  { id: 1047, name: "Boysen Burnt Umber 250ml Oil", price: 145.00, category: "Paint & Primer", img: Boysen }, 
  { id: 1048, name: "Cement Bond Gallon", price: 835.00, category: "Paint & Primer", img: CementBondImg },
  { id: 1049, name: "Chain Block 2 Ton", price: 4450.00, category: "Rigging Tools", img: ChainBlockImg },
  { id: 1050, name: "Chain Block 3 Ton", price: 5650.00, category: "Rigging Tools", img: ChainBlockImg },
  { id: 1051, name: "Chain Large", price: 350.00, category: "Hardware", img: ChainImg },
  { id: 1052, name: "Chain Medium", price: 250.00, category: "Hardware", img: ChainImg },
  { id: 1053, name: "Chain Small", price: 150.00, category: "Hardware", img: ChainImg },
  { id: 1054, name: "Chemical Hose 1", price: 110.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1055, name: "Chemical Hose 1 1/2", price: 150.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1056, name: "Chemical Hose 1 1/4", price: 130.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1057, name: "Chemical Hose 1/2", price: 55.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1058, name: "Chemical Hose 1/3", price: 30.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1059, name: "Chemical Hose 1/4", price: 25.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1060, name: "Chemical Hose 2", price: 250.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1061, name: "Chemical Hose 3/4", price: 80.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1062, name: "Chemical Hose 3/8", price: 45.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1063, name: "Chemical Hose 5/8", price: 70.00, category: "Hose & Tubing", img: ChemicalHoseImg },
  { id: 1064, name: "Concrete Epoxy Crack Injectable 1L", price: 3045.00, category: "Chemicals", img: EpoxyInjectableImg },
  { id: 1065, name: "Concrete Epoxy High-Viscosity", price: 3450.00, category: "Chemicals", img: EpoxyHighViscosityImg },
  { id: 1066, name: "Concrete Nails Kilo", price: 100.00, category: "Fasteners", img: ConcreteNailsImg },
  { id: 1067, name: "Curing Compound Drum", price: 6800.00, category: "Chemicals", img: CuringCompoundDrumImg },
  { id: 1068, name: "Curing Compound Gallon", price: 1500.00, category: "Chemicals", img: CuringCompoundGallonImg },
  { id: 1069, name: "Cut-off Blade 1 - Metro A 14\"", price: 350.00, category: "Power Tools", img: CutBladeMetroImg },
  { id: 1070, name: "Cut-off Blade 2 - Tyrolit 14\"", price: 1150.00, category: "Power Tools", img: CutoffBladeTyrolitImg },
  { id: 1071, name: "Cut-off Blade 3 - UK Master 14\"", price: 350.00, category: "Power Tools", img: CutOffBladeImg },
  { id: 1072, name: "Cut-off Blade 4 - Yestar 14\"", price: 350.00, category: "Power Tools", img: CutBladeYestar },
  { id: 1073, name: "Cyclone Wire 2x3 ft 2x2", price: 285.00, category: "Wire Mesh", img: CycloneWireImg },
  { id: 1074, name: "Cyclone Wire 2x4 ft 2x2", price: 380.00, category: "Wire Mesh", img: CycloneWireImg },
  { id: 1075, name: "Cyclone Wire 2x5 ft 2x2", price: 475.00, category: "Wire Mesh", img: CycloneWireImg },
  { id: 1076, name: "Cyclone Wire 2x6 ft 2x2", price: 570.00, category: "Wire Mesh", img: CycloneWireImg },
  { id: 1077, name: "Cyclone Wire 4x3 ft 4x4", price: 165.00, category: "Wire Mesh", img: CycloneWireImg },
  { id: 1078, name: "Cyclone Wire 4x4 ft 4x4", price: 220.00, category: "Wire Mesh", img: CycloneWireImg },
  { id: 1079, name: "Cyclone Wire 4x5 ft 4x4", price: 275.00, category: "Wire Mesh", img: CycloneWireImg },
  { id: 1080, name: "Cyclone Wire 4x6 ft 4x4", price: 330.00, category: "Wire Mesh", img: CycloneWireImg },
  { id: 1081, name: "Delaware Automotive Lacquer 4L", price: 650.00, category: "Paint & Primer", img: DelawareAutomotiveLacquerImg },
  { id: 1082, name: "Drawer Guide 13\"", price: 40.00, category: "Hardware", img: DrawerGuideImg },
  { id: 1083, name: "Drawer Guide 22\"", price: 60.00, category: "Hardware", img: DrawerGuideImg },
  { id: 1084, name: "Duct Hose 2\"", price: 45.00, category: "Hose & Tubing", img: DuctHoseImg },
  { id: 1085, name: "Duct Hose 3\"", price: 55.00, category: "Hose & Tubing", img: DuctHoseImg },
  { id: 1086, name: "Duct Hose 4\"", price: 65.00, category: "Hose & Tubing", img: DuctHoseImg },
  { id: 1087, name: "Durapatch Liter", price: 220.00, category: "Paint & Primer", img: DurapatchImg },
  { id: 1088, name: "Duratex Cast Gallon", price: 530.00, category: "Paint & Primer", img: DuratexImg },
  { id: 1089, name: "Duratex Primer Gallon", price: 930.00, category: "Paint & Primer", img: DuratexImg },
  { id: 1090, name: "Duratex Reducer Gallon", price: 530.00, category: "Paint & Primer", img: DuratexImg },
  { id: 1091, name: "Emulsion Gallon", price: 615.00, category: "Paint & Primer", img: EmulsionGallonImg },
  { id: 1092, name: "E-Primer Black Gallon", price: 765.00, category: "Paint & Primer", img: EPrimerImg },
  { id: 1093, name: "E-Primer Black Liter", price: 255.00, category: "Paint & Primer", img: EPrimerImg },
  { id: 1094, name: "E-Primer Gray Gallon", price: 765.00, category: "Paint & Primer", img: EPrimerImg },
  { id: 1095, name: "E-Primer Gray Liter", price: 255.00, category: "Paint & Primer", img: EPrimerImg },
  { id: 1096, name: "E-Primer Red Gallon", price: 765.00, category: "Paint & Primer", img: EPrimerImg },
  { id: 1097, name: "E-Primer Red Liter", price: 255.00, category: "Paint & Primer", img: EPrimerImg },
  { id: 1098, name: "E-Primer White Gallon", price: 790.00, category: "Paint & Primer", img: EPrimerImg },
  { id: 1099, name: "E-Primer White Liter", price: 255.00, category: "Paint & Primer", img: EPrimerImg },
  { id: 1100, name: "Finishing Nails / Kilo", price: 85.00, category: "Fasteners", img: FinishingNailsImg },
  { id: 1101, name: "Flat Head Nails / Kilo", price: 120.00, category: "Fasteners", img: FlatHeadNailsImg },
  { id: 1102, name: "Flat Paint Latex Gallon (MINISOTA)", price: 655.00, category: "Paint & Primer", img: MINISOTAImg },
  { id: 1103, name: "Flat Paint Latex Liter (MINISOTA)", price: 445.00, category: "Paint & Primer", img: MINISOTAImg },
  { id: 1104, name: "Flat Paint Latex Pail (Pure Coat)", price: 3320.00, category: "Paint & Primer", img: PureCoatImg },
  { id: 1105, name: "Flexible Hose 1 Meter", price: 35.00, category: "Hose & Tubing", img: FlexibleHoseImg },
  { id: 1106, name: "Flexible Hose 1/2 Meter", price: 12.00, category: "Hose & Tubing", img: FlexibleHoseImg },
  { id: 1107, name: "Flexible Hose 1/2 Roll 50m", price: 600.00, category: "Hose & Tubing", img: FlexibleHoseImg },
  { id: 1108, name: "Flexible Hose 3/4 Meter", price: 20.00, category: "Hose & Tubing", img: FlexibleHoseImg },
  { id: 1109, name: "Flexible Hose 3/4 Roll 100m", price: 850.00, category: "Hose & Tubing", img: FlexibleHoseImg },
  { id: 1110, name: "Flush Bowl Flower", price: 6000.00, category: "Sanitary Ware", img: FushBowlImg },
  { id: 1111, name: "Flush Bowl Plain", price: 4500.00, category: "Sanitary Ware", img: FushBowlImg },
  { id: 1112, name: "Folya Sheet", price: 55.00, category: "Miscellaneous", img: FolyaSheetImg },
  { id: 1113, name: "French Yellow Latex", price: 85.00, category: "Paint & Primer", img: FrenchImg },
  { id: 1114, name: "French Yellow Oil", price: 145.00, category: "Paint & Primer", img: FrenchImg },
  { id: 1115, name: "FWE Liter", price: 515.00, category: "Paint & Primer", img: FWE },
  { id: 1116, name: "FWE Mini Liter", price: 250.00, category: "Paint & Primer", img: FWE },
  { id: 1117, name: "FWE Pail", price: 3320.00, category: "Paint & Primer", img: FWE },
  { id: 1118, name: "FWE Premium Gallon", price: 730.00, category: "Paint & Primer", img: FWE },
  { id: 1119, name: "FWE Regular Gallon", price: 520.00, category: "Paint & Primer", img: FWE },
  { id: 1120, name: "G Latex Liter", price: 495.00, category: "Paint & Primer", img: G },
  { id: 1121, name: "G Latex Pail (Pure Coat)", price: 3320.00, category: "Paint & Primer", img: G },
  { id: 1122, name: "G Latex Premium Gallon", price: 750.00, category: "Paint & Primer", img: G },
  { id: 1123, name: "G Latex Regular Gallon", price: 560.00, category: "Paint & Primer", img: G },
  { id: 1124, name: "Garden Hose 1", price: 65.00, category: "Hose & Tubing", img: GardenHose },
  { id: 1125, name: "Garden Hose 1/2", price: 25.00, category: "Hose & Tubing", img: GardenHose },
  { id: 1126, name: "Garden Hose 3/4", price: 55.00, category: "Hose & Tubing", img: GardenHose },
  { id: 1127, name: "Garden Hose 5/8", price: 20.00, category: "Hose & Tubing", img: GardenHose },
  { id: 1128, name: "Gasket Maker", price: 320.00, category: "Plumbing", img: GasketMaker },
  { id: 1129, name: "GI CEE Purlin 2x3 Thick", price: 425.00, category: "Roofing", img: PurlinThick },
  { id: 1130, name: "GI CEE Purlin 2x3 Thin", price: 350.00, category: "Roofing", img: PurlinThin },
  { id: 1131, name: "GI CEE Purlin 2x4 Thick", price: 485.00, category: "Roofing", img: PurlinThick },
  { id: 1132, name: "GI CEE Purlin 2x4 Thin", price: 400.00, category: "Roofing", img: PurlinThin },
  { id: 1133, name: "GI CEE Purlin 2x6 Thick", price: 685.00, category: "Roofing", img: PurlinThick },
  { id: 1134, name: "GI CEE Purlin 2x6 Thin", price: 535.00, category: "Roofing", img: PurlinThin },
  { id: 1135, name: "GI Plain 0.6", price: 950.00, category: "Roofing Sheet", img: GIPlain },
  { id: 1136, name: "GI Plain 0.9", price: 1150.00, category: "Roofing Sheet", img: GIPlain },
  { id: 1137, name: "GI Plain 1.0", price: 1280.00, category: "Roofing Sheet", img: GIPlain },
  { id: 1138, name: "GI Plain 1.1", price: 1500.00, category: "Roofing Sheet", img: GIPlain },
  { id: 1139, name: "GI Plain 1.2", price: 1700.00, category: "Roofing Sheet", img: GIPlain },
  { id: 1140, name: "GI Plain 1.3", price: 1900.00, category: "Roofing Sheet", img: GIPlain },
  { id: 1141, name: "GI Plain 1.5", price: 2350.00, category: "Roofing Sheet", img: GIPlain },
  { id: 1142, name: "GI Tubular Steel 1x1 1.2mm Retail", price: 195.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1143, name: "GI Tubular Steel 1x1 1.2mm Wholesale", price: 185.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1144, name: "GI Tubular Steel 1x1 1.5mm Retail", price: 230.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1145, name: "GI Tubular Steel 1x1 1.5mm Wholesale", price: 210.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1146, name: "GI Tubular Steel 1x2 1.2mm Retail", price: 295.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1147, name: "GI Tubular Steel 1x2 1.2mm Wholesale", price: 282.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1148, name: "GI Tubular Steel 1x2 1.5mm Retail", price: 330.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1149, name: "GI Tubular Steel 1x2 1.5mm Wholesale", price: 315.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1150, name: "GI Tubular Steel 2x2 1.2mm Retail", price: 388.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1151, name: "GI Tubular Steel 2x2 1.2mm Wholesale", price: 372.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1152, name: "GI Tubular Steel 2x2 1.5mm Retail", price: 420.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1153, name: "GI Tubular Steel 2x2 1.5mm Wholesale", price: 410.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1154, name: "GI Tubular Steel 2x3 1.2mm Retail", price: 490.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1155, name: "GI Tubular Steel 2x3 1.2mm Wholesale", price: 472.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1156, name: "GI Tubular Steel 2x3 1.5mm Retail", price: 550.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1157, name: "GI Tubular Steel 2x3 1.5mm Wholesale", price: 520.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1158, name: "GI Tubular Steel 2x4 1.2mm Retail", price: 580.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1159, name: "GI Tubular Steel 2x4 1.2mm Wholesale", price: 666.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1160, name: "GI Tubular Steel 2x4 1.5mm Retail", price: 690.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1161, name: "GI Tubular Steel 2x4 1.5mm Wholesale", price: 665.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1162, name: "GI Tubular Steel 2x6 1.2mm Retail", price: 990.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1163, name: "GI Tubular Steel 2x6 1.5mm Retail", price: 1145.00, category: "Steel & Pipe", img: TubularSteel },
  { id: 1164, name: "Hardened Steel Nails Kilo", price: 125.00, category: "Fasteners", img: HSNails },
  { id: 1165, name: "Hinges 3 x 3 Thick", price: 75.00, category: "Hardware", img: Hinges },
  { id: 1166, name: "Hinges 3 x 3 Thin", price: 50.00, category: "Hardware", img: Hinges },
  { id: 1167, name: "Hinges 3.5 x 3.5 Thick", price: 85.00, category: "Hardware", img: Hinges },
  { id: 1168, name: "Hinges 3.5 x 3.5 Thin", price: 65.00, category: "Hardware", img: Hinges },
  { id: 1169, name: "Hinges 4 x 4 Thick", price: 95.00, category: "Hardware", img: Hinges },
  { id: 1170, name: "Hinges 4 x 4 Thin", price: 75.00, category: "Hardware", img: Hinges },
  { id: 1171, name: "Hog Wire 7 Holes", price: 1000.00, category: "Wire Mesh", img: HogWire },
  { id: 1172, name: "Hog Wire 8 Holes", price: 1050.00, category: "Wire Mesh", img: HogWire },
  { id: 1173, name: "Hog Wire 9 Holes", price: 1150.00, category: "Wire Mesh", img: HogWire },
  { id: 1174, name: "I-Bar", price: 715.00, category: "Steel & Rebar", img: IBar },
  { id: 1175, name: "Insulator Foam 10mm Double/Meter", price: 90.00, category: "Insulation", img: InsulatorFoam },
  { id: 1176, name: "Insulator Foam 10mm Double/Roll", price: 4350.00, category: "Insulation", img: InsulatorFoam },
  { id: 1177, name: "Insulator Foam 10mm Single/Meter", price: 85.00, category: "Insulation", img: InsulatorFoam },
  { id: 1178, name: "Insulator Foam 10mm Single/Roll", price: 3700.00, category: "Insulation", img: InsulatorFoam },
  { id: 1179, name: "Insulator Foam 5mm Double/Meter", price: 65.00, category: "Insulation", img: InsulatorFoam },
  { id: 1180, name: "Insulator Foam 5mm Double/Roll", price: 2700.00, category: "Insulation", img: InsulatorFoam },
  { id: 1181, name: "Insulator Foam 5mm Single/Meter", price: 50.00, category: "Insulation", img: InsulatorFoam },
  { id: 1182, name: "Insulator Foam 5mm Single/Roll", price: 1950.00, category: "Insulation", img: InsulatorFoam },
  { id: 1183, name: "Jetmatic Gasket", price: 150.00, category: "Plumbing", img: JetmaticGasket },
  { id: 1184, name: "Lamp Black Latex", price: 95.00, category: "Paint & Primer", img: LampBlack },
  { id: 1185, name: "Lamp Black Oil", price: 145.00, category: "Paint & Primer", img: LampBlack },
  { id: 1186, name: "Laquir Thinner 4L", price: 530.00, category: "Paint & Primer", img: LaquirThinner },
  { id: 1187, name: "Level Hose 1/3", price: 15.00, category: "Hose & Tubing", img: LevelHose },
  { id: 1188, name: "Level Hose 3/8", price: 18.00, category: "Hose & Tubing", img: LevelHose },
  { id: 1189, name: "Masking Tape 1\"", price: 87.00, category: "Hardware", img: MaskingTape },
  { id: 1190, name: "Masking Tape 1/2\"", price: 45.00, category: "Hardware", img: MaskingTape },
  { id: 1191, name: "Masking Tape 3/4\"", price: 75.00, category: "Hardware", img: MaskingTape },
  { id: 1192, name: "Mighty Bond 3g", price: 85.00, category: "Adhesives", img: MightyBond },
  { id: 1193, name: "Mosquito Screen 3ft / Meter", price: 150.00, category: "Wire Mesh", img: MosquitoScreenMeter },
  { id: 1194, name: "Mosquito Screen 3ft / Roll", price: 3250.00, category: "Wire Mesh", img: MosquitoScreenRoll },
  { id: 1195, name: "Mosquito Screen 4ft / Meter", price: 180.00, category: "Wire Mesh", img: MosquitoScreenMeter },
  { id: 1196, name: "Mosquito Screen 4ft / Roll", price: 4290.00, category: "Wire Mesh", img: MosquitoScreenRoll },
  { id: 1197, name: "Muriatic Acid Gallon", price: 280.00, category: "Chemicals", img: MuriaticAcid },
  { id: 1198, name: "Non-Sag Epoxy Gallon", price: 2650.00, category: "Paint & Primer", img: NonSagEpoxy },
  { id: 1199, name: "Non-Sag Epoxy Liter", price: 650.00, category: "Paint & Primer", img: NonSagEpoxy },
  { id: 1200, name: "Nylon Rope Big", price: 480.00, category: "Rope & Rigging", img: NylonBig },
  { id: 1201, name: "Nylon Rope Meter", price: 28.00, category: "Rope & Rigging", img: NylonMeter },
{ id: 1202, name: "Nylon Rope Small", price: 45.00, category: "Rope & Rigging", img: NylonSmall    }, //From Here
{ id: 1203, name: "P.E 1/2 Coupling", price: 85.00, category: "Plumbing Fitting", img: Coupling    },
{ id: 1204, name: "P.E 1/2 Elbow", price: 85.00, category: "Plumbing Fitting", img: Elbow    },
{ id: 1205, name: "P.E 1/2 Female", price: 50.00, category: "Plumbing Fitting", img: female    },
{ id: 1206, name: "P.E 1/2 Male", price: 50.00, category: "Plumbing Fitting", img:  male   },
{ id: 1207, name: "P.E 1/2 Tee", price: 95.00, category: "Plumbing Fitting", img:  Tee   },
{ id: 1208, name: "Pacific Cement 40kg", price: 170.00, category: "Construction", img: PacificCement40kg    },
{ id: 1209, name: "Patching Compound per kg", price: 35.00, category: "Construction", img: PatchingCompound1kg    },
{ id: 1210, name: "Patching Compound per Sack", price: 700.00, category: "Construction", img:  PatchingCompound1sack   },
{ id: 1211, name: "PE Hose 1 1/2 x 60 SDR-17 Meter", price: 80.00, category: "Hose & Tubing", img:  SDR17METER   },
{ id: 1212, name: "PE Hose 1 1/2 x 60 SDR-17 Roll", price: 4200.00, category: "Hose & Tubing", img:  SDR17ROLL   },
{ id: 1213, name: "PE Hose 1 1/4 x 60 SDR-17 Meter", price: 50.00, category: "Hose & Tubing", img:  SDR17METER   },
{ id: 1214, name: "PE Hose 1 1/4 x 60 SDR-17 Roll", price: 2600.00, category: "Hose & Tubing", img: SDR17ROLL    },
{ id: 1215, name: "PE Hose 1 x 60 SDR-11 Meter", price: 45.00, category: "Hose & Tubing", img:  SDR17METER   },
{ id: 1216, name: "PE Hose 1 x 60 SDR-11 Roll", price: 2650.00, category: "Hose & Tubing", img:  SDR17ROLL   },
{ id: 1217, name: "PE Hose 1 x 60 SDR-9 Meter", price: 50.00, category: "Hose & Tubing", img: SDR17METER2    },
{ id: 1218, name: "PE Hose 1/2 x 90 SDR-11 Meter", price: 18.00, category: "Hose & Tubing", img:  SDR17METER2   },
{ id: 1219, name: "PE Hose 1/2 x 90 SDR-11 Roll", price: 1550.00, category: "Hose & Tubing", img: SDR17ROLL2    },
{ id: 1220, name: "PE Hose 1/2 x 90 SDR-9 Meter", price: 23.00, category: "Hose & Tubing", img:  SDR11METER   },
{ id: 1221, name: "PE Hose 1/2 x 90 SDR-9 Roll", price: 1880.00, category: "Hose & Tubing", img: SDR17ROLL2    },
{ id: 1222, name: "PE Hose 2 SDR-17 Meter", price: 175.00, category: "Hose & Tubing", img:  SDR11METER   },
{ id: 1223, name: "PE Hose 2 SDR-17 Roll", price: 9750.00, category: "Hose & Tubing", img: SDR17ROLL2    },
{ id: 1224, name: "PE Hose 3/4 x 90 SDR-11 Meter", price: 30.00, category: "Hose & Tubing", img: SDR11METER    },
{ id: 1225, name: "PE Hose 3/4 x 90 SDR-11 Roll", price: 2600.00, category: "Hose & Tubing", img: SDR17ROLL2    },
{ id: 1226, name: "PE Hose 3/4 x 90 SDR-9 Meter", price: 40.00, category: "Hose & Tubing", img: SDR11METER    },
{ id: 1227, name: "Phenolic Board 1/2", price: 655.00, category: "Boards & Panels", img: phenoboard1    },
{ id: 1228, name: "Phenolic Board 3/4", price: 900.00, category: "Boards & Panels", img: phenoboard2    },
{ id: 1229, name: "Piano Hinges with Screw", price: 165.00, category: "Hardware", img: PHS    },
{ id: 1230, name: "Pin Light", price: 250.00, category: "Electrical", img: PinLight    },
{ id: 1231, name: "Plain Bar 10mm", price: 150.00, category: "Steel & Rebar", img: plainbar    },
{ id: 1232, name: "Plain Bar 1¼", price: 2550.00, category: "Steel & Rebar", img:  plainbar   },
{ id: 1233, name: "Plain Bar 12mm", price: 256.00, category: "Steel & Rebar", img: plainbar    },
{ id: 1234, name: "Plain Bar 16mm", price: 480.00, category: "Steel & Rebar", img: plainbar    },
{ id: 1235, name: "Plain Bar 20mm", price: 920.00, category: "Steel & Rebar", img:  plainbar   },
{ id: 1236, name: "Plain Bar 25mm", price: 1465.00, category: "Steel & Rebar", img:  plainbar   },
{ id: 1237, name: "Plain Bar 8mm", price: 65.00, category: "Steel & Rebar", img: plainbar    },
{ id: 1238, name: "Plywood 1/2 Marine", price: 560.00, category: "Boards & Panels", img:  plywoodmarine   },
{ id: 1239, name: "Plywood 1/2 Ordinary", price: 465.00, category: "Boards & Panels", img: plywoodordinary    },
{ id: 1240, name: "Plywood 3/4 Marine", price: 920.00, category: "Boards & Panels", img:  plywoodmarine   },
{ id: 1241, name: "Plywood 3/4 Ordinary", price: 800.00, category: "Boards & Panels", img: plywoodordinary    },
{ id: 1242, name: "Plywood 5mm Double Face Marine", price: 330.00, category: "Boards & Panels", img: plywooddm    },
{ id: 1243, name: "Plywood 5mm Double Face Substandard", price: 318.00, category: "Boards & Panels", img: plywoodds    },
{ id: 1244, name: "Plywood 5mm Single Face Marine", price: 300.00, category: "Boards & Panels", img: plywoodsfm    },
{ id: 1245, name: "Plywood 5mm Single Face Ordinary", price: 270.00, category: "Boards & Panels", img: plywoodsfo    },
{ id: 1246, name: "Power Spray Hose", price: 55.00, category: "Hose & Tubing", img: powerhose    },
{ id: 1247, name: "P-Trap Lavatory", price: 250.00, category: "Sanitary Ware", img:  ptraplav   },
{ id: 1248, name: "Putty Knife", price: 15.00, category: "Tools", img: puttyknife    },
{ id: 1249, name: "PVC Blue Pipe 1", price: 160.00, category: "Plumbing", img:  PVC1   },
{ id: 1250, name: "PVC Blue Pipe 1 1/2", price: 230.00, category: "Plumbing", img:  PVC1   },
{ id: 1251, name: "PVC Blue Pipe 1 1/4", price: 200.00, category: "Plumbing", img:  PVC1   },
{ id: 1252, name: "PVC Blue Pipe 1/2", price: 90.00, category: "Plumbing", img: PVC1    },
{ id: 1253, name: "PVC Blue Pipe 2", price: 280.00, category: "Plumbing", img:  PVC2   },
{ id: 1254, name: "PVC Blue Pipe 3/4", price: 120.00, category: "Plumbing", img: PVC2    },
{ id: 1255, name: "PVC Coupling 1", price: 35.00, category: "Plumbing Fitting", img: PVCCoupling    },
{ id: 1256, name: "PVC Coupling 1/2", price: 10.00, category: "Plumbing Fitting", img: PVCCoupling    },
{ id: 1257, name: "PVC Coupling 3/4", price: 15.00, category: "Plumbing Fitting", img:  PVCCoupling   },
{ id: 1258, name: "PVC Elbow 1/2 Short/Long", price: 20.00, category: "Plumbing Fitting", img: PVCElbow    },
{ id: 1259, name: "PVC Elbow 3/4 Short/Long", price: 25.00, category: "Plumbing Fitting", img: PVCElbow    },
{ id: 1260, name: "PVC Orange Pipe 1 Thick", price: 230.00, category: "Plumbing", img: PVCORANGE    },
{ id: 1261, name: "PVC Orange Pipe 1 Thin", price: 180.00, category: "Plumbing", img:  PVCORANGE   },
{ id: 1262, name: "PVC Orange Pipe 1/2 Thick", price: 80.00, category: "Plumbing", img: PVCORANGE    },
{ id: 1263, name: "PVC Orange Pipe 1/2 Thin", price: 60.00, category: "Plumbing", img: PVCORANGE    },
{ id: 1264, name: "PVC Orange Pipe 3/4 Thick", price: 100.00, category: "Plumbing", img: PVCORANGE    },
{ id: 1265, name: "PVC Orange Pipe 3/4 Thin", price: 90.00, category: "Plumbing", img: PVCORANGE    },
{ id: 1266, name: "PVC Tee Reducer 3x2", price: 50.00, category: "Plumbing Fitting", img: PVCTeeR    },
{ id: 1267, name: "PVC Tee Reducer 4x2 & 3", price: 60.00, category: "Plumbing Fitting", img: PVCTeeR    },
{ id: 1268, name: "QDE Assorted Color Gallon", price: 520.00, category: "Paint & Primer", img: AssortedColor    },
{ id: 1269, name: "QDE Black Gallon", price: 620.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1270, name: "QDE Black Liter", price: 235.00, category: "Paint & Primer", img:  AssortedColor2   },
{ id: 1271, name: "QDE Cal. Yellow Gallon", price: 650.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1272, name: "QDE Cal. Yellow Liter", price: 235.00, category: "Paint & Primer", img:  AssortedColor2   },
{ id: 1273, name: "QDE Gallon", price: 765.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1274, name: "QDE Int'L Red Gallon", price: 650.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1275, name: "QDE Int'L Red Liter", price: 235.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1276, name: "QDE Liter", price: 620.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1277, name: "QDE Orange Gallon", price: 650.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1278, name: "QDE Orange Liter", price: 235.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1279, name: "QDE Pail", price: 3600.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1280, name: "QDE S-Aluminum Gallon", price: 685.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1281, name: "QDE S-Aluminum Liter", price: 250.00, category: "Paint & Primer", img: AssortedColor2    },
{ id: 1282, name: "Raw Shiena Latex", price: 80.00, category: "Paint & Primer", img: RawShiena    },
{ id: 1283, name: "Raw Shiena Oil", price: 130.00, category: "Paint & Primer", img: RawShiena    },
{ id: 1284, name: "General Primer Red Oxide Gallon", price: 475.00, category: "Paint & Primer", img:  RedOxide   },
{ id: 1285, name: "General Primer Red Oxide Liter", price: 235.00, category: "Paint & Primer", img: RedOxide    }, //Bagui|Metal|Spicy|
{ id: 1286, name: "Roof Paint Bagui Green Gallon", price: 605.00, category: "Paint & Primer", img:  RoofPaint   },
{ id: 1287, name: "Roof Paint Gray Gallon", price: 565.00, category: "Paint & Primer", img: RoofPaint    },
{ id: 1288, name: "Roof Paint Gray Liter", price: 235.00, category: "Paint & Primer", img: RoofPaint    },
{ id: 1289, name: "Roof Paint Metal P. Red Oxide Gallon", price: 495.00, category: "Paint & Primer", img: RoofPaint    },
{ id: 1290, name: "Roof Paint Metal P. Red Oxide Liter", price: 235.00, category: "Paint & Primer", img: RoofPaint    },
{ id: 1291, name: "Roof Paint Spicy Red Gallon", price: 560.00, category: "Paint & Primer", img: RoofPaint    },
{ id: 1292, name: "Rubber Floor Paint", price: 1550.00, category: "Paint & Primer", img: RoofPaint    },
{ id: 1293, name: "Rubber Wheel 10\"", price: 950.00, category: "Hardware", img: rubberwheel    },
{ id: 1294, name: "Rubber Wheel 12\"", price: 1150.00, category: "Hardware", img: rubberwheel    },
{ id: 1295, name: "Rubber Wheel 6\"", price: 450.00, category: "Hardware", img: rubberwheel    },
{ id: 1296, name: "Rubber Wheel 8\"", price: 550.00, category: "Hardware", img: rubberwheel    },
{ id: 1297, name: "S/C Latex Liter", price: 495.00, category: "Paint & Primer", img:  Latex   },
{ id: 1298, name: "S/C Latex Pail (Pure Coat)", price: 3320.00, category: "Paint & Primer", img: Latex    },
{ id: 1299, name: "S/C Latex Premium Gallon", price: 750.00, category: "Paint & Primer", img: Latex    },
{ id: 1300, name: "S/C Latex Regular Gallon", price: 560.00, category: "Paint & Primer", img: Latex    },
{ id: 1301, name: "SGE Gallon", price: 530.00, category: "Paint & Primer", img: SGAPAINT    },
{ id: 1302, name: "SGE Pail", price: 3500.00, category: "Paint & Primer", img: SGAPAINT    },
{ id: 1303, name: "Silicone Sealant", price: 150.00, category: "Adhesives", img: SILICONESEALANT    },
{ id: 1304, name: "Skim Coat", price: 420.00, category: "Construction", img: SkimCoat    },
{ id: 1305, name: "Skim Coat", price: 405.00, category: "Paint & Primer", img: SkimCoat    },
{ id: 1306, name: "Smart Board 3.5mm", price: 320.00, category: "Boards & Panels", img: smartboard    },
{ id: 1307, name: "Smart Board 4.5mm", price: 395.00, category: "Boards & Panels", img: smartboard    },
{ id: 1308, name: "Solid Guard Brown Gallon", price: 1000.00, category: "Paint & Primer", img: SOLIDGUARD    },
{ id: 1309, name: "Solid Guard Brown Liter", price: 500.00, category: "Paint & Primer", img: SOLIDGUARD    },
{ id: 1310, name: "Solid Guard Clear Gallon", price: 1100.00, category: "Paint & Primer", img: SOLIDGUARD    },
{ id: 1311, name: "Solid Guard Clear Liter", price: 550.00, category: "Paint & Primer", img: SOLIDGUARD    },
{ id: 1312, name: "Soluidin Red Latex", price: 80.00, category: "Paint & Primer", img: Latex    },
{ id: 1313, name: "Soluidin Red Oil", price: 195.00, category: "Paint & Primer", img: Latex    },
{ id: 1314, name: "Spole Insulator", price: 85.00, category: "Electrical", img: SpoleInsulator    },
{ id: 1315, name: "Structural Square Bar 20mm", price: 855.00, category: "Steel & Rebar", img: StructuralSquareBar    },
{ id: 1316, name: "Structural Square Bar 25mm", price: 2640.00, category: "Steel & Rebar", img:  StructuralSquareBar   },
{ id: 1317, name: "Light-Duty Square Bar Orange", price: 130.00, category: "Steel & Rebar", img:  SquareBar   },
{ id: 1318, name: "Light-Duty Square Bar Red", price: 350.00, category: "Steel & Rebar", img: SquareBar    },
{ id: 1319, name: "Light-Duty Square Bar White", price: 240.00, category: "Steel & Rebar", img: SquareBar    },
{ id: 1320, name: "Light-Duty Square Bar Yellow", price: 150.00, category: "Steel & Rebar", img: SquareBar    },
{ id: 1321, name: "Suction Hose 2 Meter", price: 280.00, category: "Hose & Tubing", img: SuctionHose    },
{ id: 1322, name: "Suction Hose 3 Meter", price: 400.00, category: "Hose & Tubing", img: SuctionHose2    },
{ id: 1323, name: "Suction Hose 4 Meter", price: 620.00, category: "Hose & Tubing", img: SuctionHose    },
{ id: 1324, name: "Tackle Pulley 1\"", price: 55.00, category: "Rigging Tools", img: Pulley    },
{ id: 1325, name: "Tackle Pulley 1½\"", price: 85.00, category: "Rigging Tools", img: Pulley    },
{ id: 1326, name: "Tackle Pulley 2\"", price: 120.00, category: "Rigging Tools", img: Pulley    },
{ id: 1327, name: "Tarpauline 12ft x 100m Roll", price: 8850.00, category: "Covers & Sheets", img: TarpRoll  },
{ id: 1328, name: "Tarpauline 8ft x 60m Roll", price: 5200.00, category: "Covers & Sheets", img: TarpRoll    },
{ id: 1329, name: "T-Bar", price: 280.00, category: "Steel & Rebar", img: TBar    },
{ id: 1330, name: "Thalo Blue Latex", price: 85.00, category: "Paint & Primer", img: Latex2    },
{ id: 1331, name: "Thalo Blue Oil", price: 145.00, category: "Paint & Primer", img: Latex2    },
{ id: 1332, name: "Thalo Green Latex", price: 80.00, category: "Paint & Primer", img: Latex2    },
{ id: 1333, name: "Thalo Green Oil", price: 145.00, category: "Paint & Primer", img: Latex2    },
{ id: 1334, name: "Tie Bucks", price: 95.00, category: "Fasteners", img: Tiebox    },
{ id: 1335, name: "Tie Wire Gauge 10 Size Kilo", price: 180.00, category: "Hardware", img: TieKilo    },
{ id: 1336, name: "Tie Wire Gauge 10 Size Roll", price: 4200.00, category: "Hardware", img: TieRoll    },
{ id: 1337, name: "Tie Wire Gauge 16 Size Kilo", price: 65.00, category: "Hardware", img:  TieKilo   },
{ id: 1338, name: "Tie Wire Gauge 16 Size Roll", price: 1625.00, category: "Hardware", img: TieRoll    },
{ id: 1339, name: "Tie Wire Gauge 18 Size Kilo", price: 85.00, category: "Hardware", img: TieKilo    },
{ id: 1340, name: "Tie Wire Gauge 18 Size Kilo", price: 85.00, category: "Hardware", img:  TieKilo   },
{ id: 1341, name: "Tie Wire Gauge 18 Size Roll", price: 2240.00, category: "Hardware", img: TieRoll    },
{ id: 1342, name: "Tie Wire Gauge 18 Size Roll", price: 2240.00, category: "Hardware", img: TieRoll    },
{ id: 1343, name: "Tie Wire Gauge 20 Size Kilo", price: 180.00, category: "Hardware", img: TieKilo    },
{ id: 1344, name: "Tie Wire Gauge 20 Size Roll", price: 4200.00, category: "Hardware", img: TieRoll    },
{ id: 1345, name: "Tile Adhesive", price: 320.00, category: "Construction", img: TileAdhesive    },
{ id: 1346, name: "Tonner SMC", price: 4750.00, category: "Construction", img: Tonner    },
{ id: 1347, name: "Turn Buckle 10mm", price: 40.00, category: "Rigging Tools", img: Turnbuckle    },
{ id: 1348, name: "Turn Buckle 10mm", price: 40.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1349, name: "Turn Buckle 12mm", price: 75.00, category: "Rigging Tools", img: Turnbuckle    },
{ id: 1350, name: "Turn Buckle 12mm", price: 75.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1351, name: "Turn Buckle 14mm", price: 110.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1352, name: "Turn Buckle 14mm", price: 110.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1353, name: "Turn Buckle 16mm", price: 125.00, category: "Rigging Tools", img: Turnbuckle    },
{ id: 1354, name: "Turn Buckle 16mm", price: 125.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1355, name: "Turn Buckle 20mm", price: 180.00, category: "Rigging Tools", img: Turnbuckle    },
{ id: 1356, name: "Turn Buckle 20mm", price: 180.00, category: "Rigging Tools", img: Turnbuckle    },
{ id: 1357, name: "Turn Buckle 22mm", price: 300.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1358, name: "Turn Buckle 22mm", price: 300.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1359, name: "Turn Buckle 24mm", price: 380.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1360, name: "Turn Buckle 24mm", price: 380.00, category: "Rigging Tools", img:  Turnbuckle   },
{ id: 1361, name: "Umbrella Nails Case", price: 1600.00, category: "Fasteners", img: UmbrellaNailsCase    },
{ id: 1362, name: "Umbrella Nails Kilo", price: 75.00, category: "Fasteners", img: UmbrellaNails    },
{ id: 1363, name: "U-Nails Kilo", price: 120.00, category: "Fasteners", img: Unails    },
{ id: 1364, name: "Welded Screen 1/2x3 ft Meter", price: 195.00, category: "Wire Mesh", img: weldedscreen    },
{ id: 1365, name: "Welded Screen 1/2x3 ft Roll", price: 5450.00, category: "Wire Mesh", img:  weldedscreenroll   },
{ id: 1366, name: "Welded Screen 1/2x4 ft Meter", price: 260.00, category: "Wire Mesh", img: weldedscreen    },
{ id: 1367, name: "Welded Screen 1/2x4 ft Roll", price: 6300.00, category: "Wire Mesh", img:  weldedscreenroll   },
{ id: 1368, name: "Welded Screen 1x3 ft Meter", price: 135.00, category: "Wire Mesh", img: weldedscreen    },
{ id: 1369, name: "Welded Screen 1x3 ft Roll", price: 3250.00, category: "Wire Mesh", img:  weldedscreenroll   },
{ id: 1370, name: "Welded Screen 1x4 ft Meter", price: 175.00, category: "Wire Mesh", img:  weldedscreen   },
{ id: 1371, name: "Welded Screen 1x4 ft Roll", price: 4050.00, category: "Wire Mesh", img:  weldedscreenroll   },
{ id: 1372, name: "Welding Lens", price: 20.00, category: "Tools", img: WeldingLens    },
{ id: 1373, name: "Welding Rod 6011 Box", price: 700.00, category: "Welding Supplies", img: Weldingrodbox    },
{ id: 1374, name: "Welding Rod 6011 Kilo", price: 140.00, category: "Welding Supplies", img: Weldingrod    },
{ id: 1375, name: "Welding Rod 7018 Box", price: 925.00, category: "Welding Supplies", img: Weldingrodbox    },
{ id: 1376, name: "Welding Rod 7018 Kilo", price: 185.00, category: "Welding Supplies", img:  Weldingrod   },
{ id: 1377, name: "Welding Rod Bronze 75pc", price: 75.00, category: "Welding Supplies", img:  Weldingrod2   },
{ id: 1378, name: "Welding Rod NFiveFive Box", price: 650.00, category: "Welding Supplies", img: Weldingrodbox    },
{ id: 1379, name: "Welding Rod NFiveFive Kilo", price: 130.00, category: "Welding Supplies", img: Weldingrod    },
{ id: 1380, name: "Welding Rod Ordinary Box", price: 375.00, category: "Welding Supplies", img: Weldingrodbox    },
{ id: 1381, name: "Welding Rod Ordinary Kilo", price: 75.00, category: "Welding Supplies", img:  Weldingrod   },
{ id: 1382, name: "Welding Rod Special Box", price: 875.00, category: "Welding Supplies", img:  Weldingrodbox   },
{ id: 1383, name: "Welding Rod Special Kilo", price: 175.00, category: "Welding Supplies", img:  Weldingrod   },
{ id: 1384, name: "Welding Rod Stainless 25pc", price: 385.00, category: "Welding Supplies", img: Weldingrod2    },
{ id: 1385, name: "Wire Fastener Kilo", price: 150.00, category: "Fasteners", img: wirefastener},
{ id: 1386, name: "Wire Nails 1\" Case", price: 1815.00, category: "Fasteners", img:  wirenails   },
{ id: 1387, name: "Wire Nails 1\" Kilo", price: 75.00, category: "Fasteners", img:  wirenails2   },
{ id: 1388, name: "Wire Nails 1½\" Case", price: 1750.00, category: "Fasteners", img: wirenails    },
{ id: 1389, name: "Wire Nails 1½\" Kilo", price: 70.00, category: "Fasteners", img: wirenails2    },
{ id: 1390, name: "Wire Nails 2\" Case", price: 1750.00, category: "Fasteners", img:  wirenails   },
{ id: 1391, name: "Wire Nails 2\" Kilo", price: 70.00, category: "Fasteners", img: wirenails2    },
{ id: 1392, name: "Wire Nails 2½\" Case", price: 1750.00, category: "Fasteners", img: wirenails    },
{ id: 1393, name: "Wire Nails 2½\" Kilo", price: 70.00, category: "Fasteners", img: wirenails2   },
{ id: 1394, name: "Wire Nails 3\" Case", price: 1675.00, category: "Fasteners", img: wirenails    },
{ id: 1395, name: "Wire Nails 3\" Kilo", price: 60.00, category: "Fasteners", img:  wirenails2   },
{ id: 1396, name: "Wire Nails 4\" Case", price: 1675.00, category: "Fasteners", img: wirenails    },
{ id: 1397, name: "Wire Nails 4\" Kilo", price: 60.00, category: "Fasteners", img: wirenails2    },
{ id: 1398, name: "Wood Saver Brown Gallon", price: 1000.00, category: "Paint & Primer", img: woodsaver    },
{ id: 1399, name: "Wood Saver Brown Liter", price: 500.00, category: "Paint & Primer", img: woodsaver2    },
{ id: 1400, name: "Wood Saver Clear Gallon", price: 1100.00, category: "Paint & Primer", img:  woodsaver   },
{ id: 1401, name: "Wood Saver Clear Liter", price: 550.00, category: "Paint & Primer", img: woodsaver2    },
{ id: 1402, name: "Z-Bar", price: 260.00, category: "Steel & Rebar", img: zbar    },
];

svc.fetchProducts().then(list => {
  if (Array.isArray(list) && list.length) {
    const byId = new Map(products.map(p => [p.id, p]));
    products = list.map(p => {
      const local = byId.get(p.id) || {};
      return {
        id: p.id,
        name: p.name || local.name,
        price: p.price || local.price,
        category: p.category || local.category,
        img: local.img || PlaceholderImg
      };
    });
  }
}).catch(() => {
 
});

function getBaseName(name) {
  const digitIdx = name.search(/\d/);
  if (digitIdx > 0) return name.slice(0, digitIdx).trim();
  const base = name.replace(
    /\b(6011|7018|Bronze|N-55|Ordinary|Special|Stainless|Bagui|Metal|Spicy|Reducer|Primer|Cast|Regular|Premium|Mini|Sheet|Plain|Flower|Oil|Latex|Large|Big|Medium|Small|Gallon|Drum|Liter|Roll|Meter|ft|kg|kilo|Kilo|Case|Pail|Box|pc|pcs|m|mm|in|"|-inch|inch|Black|Gray|White|Orange|Red|White|Yellow|Brown|Clear|Blue|Green)\b.*$/i,
    ""
  ).trim();
  return base || name;
}

function getVariantLabel(base, name) {
  const label = name.slice(base.length).trim();
  return label || "";
}

function imgOnError(e) {
  e.target.src = "/fallback.png";
}

function QuantityModal({ product, qty, setQty, onConfirm, onCancel, currentStock }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white p-16 rounded-lg shadow-lg w-[500px] text-center">
        <div className="absolute top-3 right-3 text-sm text-gray-600">Current Stock: {currentStock || 0}</div>
        <img
          src={product.img}
          alt={product.name}
          onError={imgOnError}
          className="w-20 h-20 mx-auto mb-2 object-contain"
        />
        <h2 className="font-semibold text-lg">{product.name}</h2>
        {product.variantLabel && (
          <p className="text-sm text-gray-600 mb-1">Variant: {product.variantLabel}</p>
        )}
        <p className="text-sm font-medium mb-4">₱{(product.price ?? 0).toFixed(2)}</p>

        <label className="block text-sm font-medium mb-1">Quantity</label>
        <div className="flex items-center justify-center gap-2 mb-4">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2 py-1 bg-gray-200 rounded"><FaMinus /></button>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1")))}
            className="w-16 text-center border rounded"
          />
          <button onClick={() => setQty(q => q + 1)} className="px-2 py-1 bg-gray-200 rounded"><FaPlus /></button>
        </div>

        <div className="flex justify-center gap-2">
          <button onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-orange-500 text-white rounded">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ baseName, variants, onAddToCart, inventoryMap }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [qtyModalOpen, setQtyModalOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const selected = variants[selectedIndex];

  const handleAddClick = () => {
    setQty(1);
    setQtyModalOpen(true);
  };

  const confirmAdd = async () => {
    if (!onAddToCart) return;
    const ok = await onAddToCart(
      {
        id: selected.id,
        name: baseName,
        variantLabel: selected.label || "",
        price: Number(selected.price) || 0,
        img: selected.img,
      },
      qty
    );
    // only close modal when add was successful; otherwise keep it open so user can adjust qty
    if (ok) setQtyModalOpen(false);
  };

  return (
    <div className="relative border rounded-lg p-4 shadow-sm bg-white">
      {(() => {
        const raw = inventoryMap ? inventoryMap[selected.id] : undefined;
        const stock = raw != null ? Number(raw) : null; // null when inventory not loaded for this id
  const lowThreshold = 15; // match Inventory threshold
        let badgeClasses = "absolute top-3 right-3 z-20 text-xs px-2 py-1 rounded-full font-medium shadow";
        let label = '';
        if (stock === null) {
          badgeClasses += " bg-gray-100 text-gray-700";
          label = '—';
        } else if (stock <= 0) {
          badgeClasses += " bg-red-100 text-red-700";
          label = 'Current Stock: 0';
        } else if (stock <= lowThreshold) {
          badgeClasses += " bg-yellow-100 text-yellow-800";
          label = `Current Stock: ${stock}`;
        } else {
          badgeClasses += " bg-green-100 text-green-700";
          label = `Current Stock: ${stock}`;
        }
        return <div className={badgeClasses} aria-live="polite" aria-atomic="true">{label}</div>;
      })()}
      <h3 className="font-semibold text-lg text-gray-800">
        {baseName} {selected.label && `- ${selected.label}`}
      </h3>
  <p className="text-sm text-gray-700">₱{(Number(selected.price) || 0).toFixed(2)}</p>
      <div className="mt-2 h-32 flex items-center justify-center">
        <img
          src={selected.img}
          alt={selected.label}
          onError={imgOnError}
          className="max-h-28 object-contain"
        />
      </div>

      <div className="mt-2 flex justify-between items-center gap-2">
        <button
          className="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          onClick={handleAddClick}
        >
          + Add to Cart
        </button>
        {variants.length > 1 && (
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
          >
            {variants.map((v, i) => (
              <option key={v.id} value={i}>
                {v.label || "Default"}
              </option>
            ))}
          </select>
        )}
      </div>

      {qtyModalOpen && (
        <QuantityModal
          product={{
            id: selected.id,
            name: baseName,
            variantLabel: selected.label || "",
            price: selected.price,
            img: selected.img,
          }}
          qty={qty}
          setQty={setQty}
          onConfirm={confirmAdd}
          onCancel={() => setQtyModalOpen(false)}
          currentStock={inventoryMap ? (inventoryMap[selected.id] || 0) : 0}
        />
      )}
    </div>
  );
}

export default function POS() {
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [pendingReceipt, setPendingReceipt] = useState(null);
  const [cart, setCart] = useState([]);
  const [transientMessage, setTransientMessage] = useState(null);
  const [transientVisible, setTransientVisible] = useState(false);
  const transientTimerRef = React.useRef(null);

  function showTransientMessage(msg) {
    if (transientTimerRef.current) {
      clearTimeout(transientTimerRef.current);
      transientTimerRef.current = null;
    }
    setTransientMessage(msg);
    // start visible then hide after 3s with fade
    setTransientVisible(true);
    transientTimerRef.current = setTimeout(() => {
      setTransientVisible(false);
      // remove message after fade-out (300ms)
      transientTimerRef.current = setTimeout(() => {
        setTransientMessage(null);
        transientTimerRef.current = null;
      }, 300);
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (transientTimerRef.current) {
        clearTimeout(transientTimerRef.current);
        transientTimerRef.current = null;
      }
    };
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [lastReceipt, setLastReceipt] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [qty, setQty] = useState(1);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [inventory, setInventory] = useState({});

  const addToCart = (product, quantity = 1) => {
    // validate against live inventory before adding
    const stock = inventory && inventory[product.id] != null ? Number(inventory[product.id]) : null;
    if (stock === 0) {
      // out of stock — show transient message
      showTransientMessage(`${product.name} is out of stock`);
      return;
    }
    if (stock != null && quantity > stock) {
      showTransientMessage(`Insufficient stock for ${product.name}. Available: ${stock}`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find(
        (it) => it.id === product.id && it.variantLabel === product.variantLabel
      );
      if (existing) {
        return prevCart.map((it) =>
          it.id === product.id && it.variantLabel === product.variantLabel
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    return true;
  };

  useEffect(() => {
    let mounted = true;
    async function loadInv() {
      try {
        const res = await fetch(`${cfg.API_BASE}/inventory`);
        const data = await res.json();
        const map = {};
        data.forEach((i) => (map[i.product_id] = i.qty_on_hand));
        if (mounted) setInventory(map);
      } catch (e) {
        console.error('load inventory', e);
      }
    }
    // also load server products to override local product metadata when available
    async function loadServerProducts() {
      try {
        const r = await fetch(`${cfg.API_BASE}/products`);
        if (!r.ok) return;
        const list = await r.json();
        // replace local products' fields (name, price, img, category) when id matches
        const map = {};
        list.forEach(p => { map[Number(p.id)] = p; });
        // mutate exported products array in-place where ids match
        products = products.map(lp => {
          const srv = map[Number(lp.id)];
          if (srv) return { ...lp, name: srv.name || lp.name, price: srv.price || lp.price, img: srv.img || lp.img, category: srv.category || lp.category };
          return lp;
        });
      } catch (e) { /* ignore */ }
    }
    loadInv();
    loadServerProducts();
    function onProductsUpdated() { loadInv(); loadServerProducts(); }
    window.addEventListener('products:updated', onProductsUpdated);
    window.addEventListener('inventory:updated', onProductsUpdated);
    return () => { mounted = false; };
  }, []);

  const updateQuantity = (index, amount) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
          : item
      )
    );
  };

  const removeFromCart = (index) =>
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));

  const handleEditQuantity = (item, index) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
    setQty(item.quantity);
    setShowQtyModal(true);
  };

  const confirmEditQuantity = () => {
    if (selectedItemIndex == null) return;
    setCart((prev) =>
      prev.map((it, i) =>
        i === selectedItemIndex ? { ...it, quantity: Math.max(1, qty) } : it
      )
    );
    setShowQtyModal(false);
    setSelectedItem(null);
    setSelectedItemIndex(null);
  };

  const [checkoutError, setCheckoutError] = useState(null);

  const handleCheckout = () => {
    setCheckoutError(null);
    if (!cart || !cart.length) return;
    // validate against current inventory
    for (const it of cart) {
      const stock = inventory && inventory[it.id] != null ? Number(inventory[it.id]) : null;
      if (stock === 0) {
        setCheckoutError(`${it.name} is out of stock`);
        return;
      }
      if (stock != null && it.quantity > stock) {
        setCheckoutError(`Not enough stock for ${it.name}. Available: ${stock}, Requested: ${it.quantity}`);
        return;
      }
    }

    const receipt = {
      id: `R-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart.map((it) => ({ id: it.id, name: it.name + (it.variantLabel ? ` - ${it.variantLabel}` : ''), qty: it.quantity, unit: it.price }))
    };
    setPendingReceipt(receipt);
    setShowOrderSummary(true);
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const groupsMap = {};
  filteredProducts.forEach((p) => {
    const base = getBaseName(p.name);
    if (!groupsMap[base]) groupsMap[base] = [];
    groupsMap[base].push(p);
  });

  const groupedProducts = Object.entries(groupsMap).map(([base, items]) => {
    const variants = items.map((it) => ({
      id: it.id,
      label: getVariantLabel(base, it.name),
      price: Number(it.price) || 0,
      img: it.img,
    }));
    return { baseName: base, variants };
  });

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      {/* transient toast (not part of cart) */}
      {transientMessage && (
        <div className="fixed inset-0 flex items-start justify-center pointer-events-none" style={{ zIndex: 200000 }}>
          <div className={`mt-24 bg-red-600 text-white px-5 py-2 rounded shadow max-w-xl text-center transition-opacity duration-300 ${transientVisible ? 'opacity-100' : 'opacity-0'}`} style={{ pointerEvents: 'auto' }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-left">{transientMessage}</div>
              <button className="ml-4 text-white bg-red-700 hover:bg-red-800 rounded px-2 py-1 text-sm" onClick={() => { setTransientVisible(false); setTimeout(() => setTransientMessage(null), 300); }}>Close</button>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Point of Sale</h1>
      <p className="text-sm text-gray-500 mb-6">
        Process sales transactions for hardware and construction supplies.
      </p>

      <div className="flex gap-6">
        {/* Product Menu */}
        <div className="flex-1 flex flex-col">
          {/* Search + Category Filter */}
          <div className="flex gap-4 items-center mb-4">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-4 py-2 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Scrollable Product Grid */}
          <div className="flex-1 overflow-y-auto max-h-[850px] pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {groupedProducts.map((g) => (
                <ProductCard
                  key={g.baseName}
                  baseName={g.baseName}
                  variants={g.variants}
                  onAddToCart={addToCart}
                  inventoryMap={inventory}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Static Cart Panel */}
        <div className="w-[500px]">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                {cart.length} items
              </span>
            </div>

            <div className="h-[350px] bg-gray-50 p-4 rounded-md shadow-inner overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-700 text-center">Your cart is empty.</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        onError={imgOnError}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div className="flex-1 px-2">
                        <h2 className="text-sm font-semibold">{item.name}</h2>
                        {item.variantLabel && (
                          <p className="text-xs text-gray-600">
                            Variant: {item.variantLabel}
                          </p>
                        )}
                        <p className="text-gray-700 text-sm">
                          Unit: ₱{(item.price ?? 0).toFixed(2)}
                        </p>
                        <p className="text-sm font-medium">
                          Subtotal: ₱{((item.price ?? 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <button
                            className="bg-gray-300 p-1 rounded-md hover:bg-gray-400"
                            onClick={() => updateQuantity(index, -1)}
                          >
                            <FaMinus />
                          </button>
                          <span className="text-sm font-bold text-blue-600">
                            {item.quantity}
                          </span>
                          <button
                            className="bg-gray-300 p-1 rounded-md hover:bg-gray-400"
                            onClick={() => updateQuantity(index, 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-sm text-gray-700 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleEditQuantity(item, index)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 text-sm"
                            onClick={() => removeFromCart(index)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>
                  ₱{cart.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0).toFixed(2)}
                </span>
              </div>
              <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition" onClick={() => {
                if (!cart.length) return;
                handleCheckout();
              }}>Checkout</button>
            {/* Show checkout error if any */}
            {checkoutError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
                {checkoutError}
              </div>
            )}
            {/* Order Summary Modal */}
            {showOrderSummary && pendingReceipt && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded shadow w-[480px]">
                  <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                  <div className="text-sm text-gray-600 mb-3">{new Date(pendingReceipt.date).toLocaleString()}</div>
                  <div className="mb-4 max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left">Item</th>
                          <th className="text-center">Qty</th>
                          <th className="text-right">Price</th>
                          <th className="text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                  {pendingReceipt.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.name}</td>
                      <td className="text-center">{it.qty}</td>
                      <td className="text-right">₱{(it.unit ?? 0).toFixed(2)}</td>
                      <td className="text-right">₱{((it.unit ?? 0) * it.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>₱{pendingReceipt.items.reduce((sum, it) => sum + (it.unit ?? 0) * it.qty, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => { setShowOrderSummary(false); setPendingReceipt(null); }}>Cancel</button>
              <button className="px-3 py-1 bg-orange-500 text-white rounded" onClick={async () => {
                // Confirmed: perform checkout for each item and validate server responses
                let ok = true;
                for (const it of pendingReceipt.items) {
                  try {
                    const resp = await fetch(`${cfg.API_BASE}/performance/record-sale`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: it.id, qty: it.qty, total: it.qty * (it.unit ?? 0) }) });
                    if (!resp.ok) {
                      const body = await resp.json().catch(() => ({}));
                      const msg = body && body.error ? `${body.error}${body.available ? `. Available: ${body.available}` : ''}` : 'Checkout failed';
                      showTransientMessage(msg);
                      ok = false;
                      break;
                    }
                  } catch (e) {
                    console.error('record sale error', e);
                    showTransientMessage('Checkout failed (network/server error)');
                    ok = false;
                    break;
                  }
                }
                if (ok) {
                  // refresh inventory map so UI updates immediately
                  try {
                    const r = await fetch(`${cfg.API_BASE}/inventory`);
                    if (r.ok) {
                      const data = await r.json();
                      const map = {};
                      data.forEach(i => (map[i.product_id] = i.qty_on_hand));
                      setInventory(map);
                    }
                  } catch (e) { /* ignore inventory refresh errors */ }

                  setLastReceipt(pendingReceipt);
                  setCart([]);
                  setShowOrderSummary(false);
                  setPendingReceipt(null);
                } else {
                  // keep the modal open so user can adjust quantities
                }
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
            </div>
          </div>
        </div>
      </div>

      {/* Shared Quantity Modal for Editing */}
      {showQtyModal && selectedItem && (
        <QuantityModal
          product={selectedItem}
          qty={qty}
          setQty={setQty}
          onConfirm={confirmEditQuantity}
          onCancel={() => {
            setShowQtyModal(false);
            setSelectedItem(null);
            setSelectedItemIndex(null);
          }}
          currentStock={inventory ? (inventory[selectedItem.id] || 0) : 0}
        />
      )}

      {/* Printable Receipt Modal */}
      {lastReceipt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow w-[480px] print:w-full print:rounded-none print:shadow-none print:p-2">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold">Nagasat Hardware</h2>
              <div className="text-sm text-gray-600">Main Branch</div>
              <div className="text-xs text-gray-500">Lanao, Kidapawan City, Philippines</div>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Receipt:</span>
              <span>{lastReceipt.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Date:</span>
              <span>{new Date(lastReceipt.date).toLocaleString()}</span>
            </div>
            <hr className="my-2" />
            <div className="mb-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left">Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {lastReceipt.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.name}</td>
                      <td className="text-center">{it.qty}</td>
                      <td className="text-right">₱{(it.unit ?? 0).toFixed(2)}</td>
                      <td className="text-right">₱{((it.unit ?? 0) * it.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 mb-4">
              <span>Total:</span>
              <span>₱{lastReceipt.items.reduce((sum, it) => sum + (it.unit ?? 0) * it.qty, 0).toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500 mb-4 text-center">Thank you for your purchase!</div>
            <div className="flex justify-end gap-2 print:hidden">
              <button className="px-3 py-1 border rounded" onClick={() => setLastReceipt(null)}>Close</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => window.print()}>Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}
