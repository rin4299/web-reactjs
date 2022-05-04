"use strict";
const Models = require("../models");
const PasswordUtils = require("../../services/password");
 
const dataRole = [
 {
   nameRole: "admin",
   description: "admin",
   isActive: true,
 },
 {
   nameRole: "staff",
   description: "staff",
   isActive: true,
 },
 {
   nameRole: "user",
   description: "user",
   isActive: true,
 },
];

const dataUser = [
 {
   email: "staff@gmail.com",
   name: "staff",
   roleId: 2,
   isVerifyEmail: true,
 },
 {
   email: "user@gmail.com",
   name: "user",
   roleId: 3,
   isVerifyEmail: true,
 },
 {
  email: "storea@gmail.com",
  name: "StoreA",
  roleId: 1,
  isVerifyEmail: true,
},
{
  email: "storeb@gmail.com",
  name: "StoreB",
  roleId: 1,
  isVerifyEmail: true,
},
{
  email: "storec@gmail.com",
  name: "StoreC",
  roleId: 1,
  isVerifyEmail: true,
},
 ];
 
const dataCategory = [
 {
   nameCategory: "CABLING",
   image: "https://via.placeholder.com/300x300.png",
   isActive: true,
   createdAt: "2019-12-05T15:03:11.311Z",
   updatedAt: "2019-12-05T15:08:15.904Z",
 },
 {
   nameCategory: "LIGHTING",
   image: "https://via.placeholder.com/300x300.png",
   isActive: true,
   createdAt: "2019-12-05T15:04:12.107Z",
   updatedAt: "2019-12-05T15:09:01.724Z",
 },
 {
   nameCategory: "WIRING",
   image: "https://via.placeholder.com/300x300.png",
   isActive: true,
   createdAt: "2019-12-05T15:04:16.727Z",
   updatedAt: "2019-12-05T15:09:48.556Z",
 },
 {
   nameCategory: "SECURITY",
   image: "https://via.placeholder.com/300x300.png",
   isActive: true,
   createdAt: "2019-12-05T15:04:30.555Z",
   updatedAt: "2019-12-05T15:10:34.649Z",
 },
 {
   nameCategory: "HEATING",
   image: "https://via.placeholder.com/300x300.png",
   isActive: true,
   createdAt: "2019-12-05T15:04:25.278Z",
   updatedAt: "2019-12-05T15:11:12.111Z",
 },
 {
   nameCategory: "TOOLS",
   image: "https://via.placeholder.com/300x300.png",
   isActive: true,
   createdAt: "2019-12-05T15:04:25.278Z",
   updatedAt: "2019-12-05T15:11:12.111Z",
 },
];
 
const dataProducer = [
  {
    name: "PHILIPS",
    categoryId: "LIGHTING",
    isActive: true,
    image: "https://i.ibb.co/gd1D46x/PHILIPS.png",
  },
  {
    name: "PANASONIC",
    categoryId: "LIGHTING",
    isActive: true,
    image: "https://i.ibb.co/r0ddxVj/panasonic-logo.png",
  },
  {
    name: "NANOCO",
    categoryId: "LIGHTING",
    isActive: true,
    image: "https://i.ibb.co/N1CDJ1F/logo.webp",
  },
  {
    name: "SINO",
    categoryId: "LIGHTING",
    isActive: true,
    image: "https://i.ibb.co/dBQztkN/logo-sino-top.png",
  },
  {
    name: "DUHAL",
    categoryId: "LIGHTING",
    isActive: true,
    image: "https://i.ibb.co/9b4RQtG/cong-ty-den-duhal.jpg",
  },
  {
    name: "CADI-SUN",
    categoryId: "CABLING",
    isActive: true,
    image: "https://i.ibb.co/MCGmW26/logo-invest-ko-slogan.jpg",
  },
 {
    name: "TACHIKO",
    categoryId: "CABLING",
    isActive: true,
    image: "https://i.ibb.co/8Y1k2H0/9829logo-tachiko-day-cap-dien.jpg",
  },
  {
    name: "TAESUNG",
    categoryId: "CABLING",
    isActive: true,
    image: "https://i.ibb.co/XWrDh3S/TAESUNG.jpg",
  },
  {
    name: "ELECTRIC",
    categoryId: "CABLING",
    isActive: true,
    image: "https://i.ibb.co/Cw6ZxQ1/modern-electric-energy-logo-symbol-260nw-1640513887.webp",
  },
  {
    name: "LIOA",
    categoryId: "CABLING",
    isActive: true,
    image: "https://i.ibb.co/mTsHxMh/LIOA.png",
  },
  {
    name: "SANWA",
    categoryId: "WIRING",
    isActive: true,
    image: "https://i.ibb.co/sqvpXYY/a55b33546a1626cfef26bdeadeb13f4c.jpg",
  },
  {
    name: "INAX",
    categoryId: "WIRING",
    isActive: true,
    image: "https://i.ibb.co/z8dZyvy/inax-2.jpg",
  },
  {
    name: "SONHO",
    categoryId: "WIRING",
    isActive: true,
    image: "https://i.ibb.co/CzF58Vv/890e2e62c36e800d892402524d7e670e.jpg",
  },
  {
    name: "TOTO",
    categoryId: "WIRING",
    isActive: true,
    image: "https://i.ibb.co/FD7h1Sb/og-img.png",
  },
  {
    name: "ARISTON",
    categoryId: "WIRING",
    isActive: true,
    image: "https://i.ibb.co/k6Pz8Xj/ariston-logo-rgb.webp",
  },
  {
    name: "TIENPHONG",
    categoryId: "HEATING",
    isActive: true,
    image: "https://i.ibb.co/zNSZv1n/download.png",
  },
  {
    name: "CAESAR",
    categoryId: "HEATING",
    isActive: true,
    image: "https://i.ibb.co/whRMX3b/1590044175709.jpg",
  },
  {
    name: "HDPE",
    categoryId: "HEATING",
    isActive: true,
    image: "https://i.ibb.co/Rgg7660/images.png",
  },
  {
    name: "REHAU",
    categoryId: "HEATING",
    isActive: true,
    image: "https://i.ibb.co/Kb1Z6rW/rehau-logo-vector.png",
  },
  {
    name: "UPVC",
    categoryId: "HEATING",
    isActive: true,
    image: "https://i.ibb.co/6b3MS2M/images.png",
  },
  {
    name: "GARLAND",
    categoryId: "TOOLS",
    isActive: true,
    image: "https://i.ibb.co/D8sfw1J/download.png",
  },
  {
    name: "BINHMINH",
    categoryId: "TOOLS",
    isActive: true,
    image: "https://i.ibb.co/1qP7HBh/logo-binhminh-4-02-1-orig.jpg",
  },
  {
    name: "EDISON",
    categoryId: "TOOLS",
    isActive: true,
    image: "https://i.ibb.co/Q9mjTDV/download.png",
  },
  {
    name: "ASHLEY",
    categoryId: "TOOLS",
    isActive: true,
    image: "https://i.ibb.co/Xjk9Q7p/kisspng-ashley-homestore-ashley-furniture-industries-manuf-5b0fc6f0a057c5-3887915115277606246568.jpg",
  },
  {
    name: "AVIT",
    categoryId: "TOOLS",
    isActive: true,
    image: "https://i.ibb.co/rQHLNpq/download.png",
  },
  {
    name: "BLACKSPUR",
    categoryId: "SECURITY",
    isActive: true,
    image: "https://i.ibb.co/DRMs5J7/download.png",
  },
  {
    name: "CQR",
    categoryId: "SECURITY",
    isActive: true,
    image: "https://i.ibb.co/qRMbKhF/download.jpg",
  },
  {
    name: "ESP",
    categoryId: "SECURITY",
    isActive: true,
    image: "https://i.ibb.co/ZGSQRqV/download.png",
  },
  {
    name: "KNIGHT",
    categoryId: "SECURITY",
    isActive: true,
    image: "https://i.ibb.co/TR2nHdm/images.png",
  },
 ];
 
const dataProduct = [
 {
   nameProduct: "Zexum 0.75mm 3 Core PVC Flex Cable White Round 2183Y",
   image: "https://i.ibb.co/y0v06hq/Zexum-0-75mm-3-Core-PVC-Flex-Cable-White-Round-2183-Y.jpg",
   gallery: ["https://i.ibb.co/y0v06hq/Zexum-0-75mm-3-Core-PVC-Flex-Cable-White-Round-2183-Y.jpg","https://i.ibb.co/pW8cGyS/Zexum-0-75mm-3-Core-PVC-Flex-Cable-White-Round-2183-Y-2.jpg"],
   price: 1.18,
   description:
     "6 Amp Brown, Blue & Earth H03VV-F Light Duty Flexible Circular Wire for Indoor uses up to 300V such as Light Fittings, Downlights, Cabinet Lighting, Radios, Toasters, Kettles and Hair Dryers.",
   numberAvailable: 13,
   properties: {},
   isActive: true,
   categoryId: "CABLING",
   producerId: "CADI-SUN",
   createdAt: "2019-12-05T16:04:13.441Z",
   updatedAt: "2019-12-29T07:16:29.960Z",
 },
 {
   nameProduct: "Zexum 16mm 5 Core 96A 6945X Steel Wire",
   image: "https://i.ibb.co/02Zsf67/2544.jpg",
   gallery: ["https://i.ibb.co/02Zsf67/2544.jpg"],
   price: 1.84,
   description:
     "Steel Wire Armoured Cable, commonly known as SWA Cable, is a hard-wearing power cable which is designed for the supply of mains electricity. Suitable for use in power networks, underground, internal, external applications and for use in cable ducting. It can also be connected to an earth via a Cable Gland which will give the cable further protection." ,
   numberAvailable: 17,
   properties: {},
   isActive: true,
   categoryId: "CABLING",
   producerId: "TACHIKO",
   createdAt: "2019-12-05T15:35:27.795Z",
   updatedAt: "2019-12-29T07:41:23.140Z",
 },
 {
   nameProduct: "KnightsBridge T4 Under Cabinet Linkable Fluorescent",
   image: "https://i.ibb.co/YpzPS9q/1034.png",
   gallery: ["https://i.ibb.co/YpzPS9q/1034.png","https://i.ibb.co/8X81bxs/1034-4.png","https://i.ibb.co/BwGHZ7n/1034-1.png"],
   price: 7.31,
   description:
     "Note: These fittings are supplied with a 2M lead, however, the end is left without a plug for hard-wiring into walls. You may be interested in a UK Plug Top or a Flex Outlet Socket for use with this product",
   numberAvailable: 17,
   properties: {},
   isActive: true,
   categoryId: "LIGHTING",
   producerId: "PHILIPS",
   createdAt: "2019-12-05T15:35:02.383Z",
   updatedAt: "2019-12-29T07:43:07.318Z",
 },
 {
   nameProduct: "Eterna LED Corner Wall Body Outside Light Fitting",
   image: "https://i.ibb.co/qMsgcsR/1552.jpg",
   gallery: ["https://i.ibb.co/BfcZ4nC/1552-1.jpg","https://i.ibb.co/qMsgcsR/1552.jpg"],
 
   price: 23.18,
   description:
     "The Eterna WGLEDBK & WGLEDWH Outdoor LED Wall Light is simply styled for your exterior wall. Hard-wearing and vandal proof, this attractive white polycarbonate fitting with a polycarbonate diffuser and metal bracket is built for life outdoors.",
   numberAvailable: 10,
   properties: {},
   isActive: true,
   categoryId: "LIGHTING",
   producerId: "PANASONIC",
   createdAt: "2019-12-05T15:32:30.559Z",
   updatedAt: "2019-12-29T07:46:51.049Z",
 },
 {
   nameProduct: "Burco Cygnet 10L Electric Water Boiler - Stainless Steel",
   image: "https://i.ibb.co/1b8D3r4/2724-1.jpg",
   gallery: ["https://i.ibb.co/1b8D3r4/2724-1.jpg","https://i.ibb.co/92FbB20/2724.jpg"],
 
   price: 862,
   description:
     "This manual fill Burco 10 Litre autofill water boiler is an ideal tea urn for all sorts of hot drinks. This stylish, portable and efficient water boiler is suitable for use in catering, retail and commercial environments such as offices, construction sites, sports, leisure & church halls and clubs.",
   numberAvailable: 15,
   properties: {},
   isActive: true,
   categoryId: "HEATING",
   producerId: "UPVC",
   createdAt: "2019-12-05T15:56:51.690Z",
   updatedAt: "2019-12-29T07:22:33.712Z",
 },
 {
   nameProduct: "Tagu PowerFlame 23 Inch Electric Fire",
   image: "https://i.ibb.co/dGDNBbT/5292.jpg",
   gallery: ["https://i.ibb.co/dGDNBbT/5292.jpg","https://i.ibb.co/kqMJfpK/5292-2.jpg","https://i.ibb.co/bBgpND6/5292-6.jpg"],
 
   price: 220.83,
   description:
     "Having a depth of only 15cm, the TAGU PowerFlame firebox can be easily framed into masonry fireplaces or walls using the optional FISK-23 Installation Kit.",
   numberAvailable: 12,
   properties: {},
   isActive: true,
   categoryId: "HEATING",
   producerId: "CAESAR",
   createdAt: "2019-12-05T15:56:00.394Z",
   updatedAt: "2019-12-29T07:24:29.343Z",
 },
// {
//    nameProduct: "Zexum Deluxe IEC UK Mains Adapter Trailing Socket Lead with Neon",
//    image: "https://i.ibb.co/9qbtKRZ/Zexum-Deluxe-IEC-C14-Male-to-13-A-4-Gang-UK-Mains-Adapter-Trailing-Socket-Lead-with-Neon-1.jpg",
//    gallery: ["https://i.ibb.co/9qbtKRZ/Zexum-Deluxe-IEC-C14-Male-to-13-A-4-Gang-UK-Mains-Adapter-Trailing-Socket-Lead-with-Neon-1.jpg","https://i.ibb.co/Ns4JdvH/Zexum-Deluxe-IEC-C14-Male-to-13-A-4-Gang-UK-Mains-Adapter-Trailing-Socket-Lead-with-Neon-2.jpg","https://i.ibb.co/K2gn0yn/Zexum-Deluxe-IEC-C14-Male-to-13-A-4-Gang-UK-Mains-Adapter-Trailing-Socket-Lead-with-Neon-3.jpg"],
//    price: 6.97,
//    description:
//      "Zexum Deluxe IEC C14 to 4 Gang Single Socket Adapter Lead with Neon, suitable to convert power from an IEC C13 within the rack, UPS or Computer. May also be suitable to convert IEC outputs on stage lighting to a four gang socket.Assembled to the highest standard and quality in the UK.",
//    numberAvailable: 9,
//    properties: {},
//    isActive: true,
//    categoryId: "CABLING",
//    producerId: "CADI-SUN",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Zexum Black RJ45 Cat6 High Quality Stranded Snagless UTP Ethernet Network LAN Patch Cable",
//    image: "https://i.ibb.co/hV6QHFc/918.jpg",
//    gallery: ["https://i.ibb.co/hV6QHFc/918.jpg","https://i.ibb.co/37DCC6T/918-1.jpg","https://i.ibb.co/3r2PYW8/918-2.jpg"],
//    price: 0.85,
//    description:
//      "RJ45 Cat6 Network Cables can be used to connect any network enabled device such as a PC, Laptop, Printer, Scanner, BluRay Player or Games Console (Xbox 360, Xbox One, PS3 and PS4) into a Modem or Router to allow the transfer of data to and from the device at up to a speed of 1 Gbps (Gigabit per second). ",
//    numberAvailable: 11,
//    properties: {},
//    isActive: true,
//    categoryId: "CABLING",
//    producerId: "TACHIKO",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Sealey 7 Core 0.75mm Thin Wall Automotive Cable - 30 Meter",
//    image: "https://i.ibb.co/bHVRVjT/3928.jpg",
//    gallery: ["https://i.ibb.co/bHVRVjT/3928.jpg","https://i.ibb.co/4N3H8GB/3928-1.jpg"],
//    price: 52.76,
//    description:
//      "Thin wall automotive cable 7 Core cable with coloured core conductors 0.75mm (24/0.20mm) 30 Meter Coil ROHS Compliannt",
//    numberAvailable: 13,
//    properties: {},
//    isActive: true,
//    categoryId: "CABLING",
//    producerId: "TAESUNG",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "KnightsBridge 230V IP65 10 x 0.2w Cool White LED Kit 6000K",
//    image: "https://i.ibb.co/bFNBN3Z/4615.jpg",
//    gallery: ["https://i.ibb.co/bFNBN3Z/4615.jpg"],
//    price: 35.75,
//    description:
//      "LED Recessed Kit complete includes 10 x 0.2w Stainless Steel Bezel IP65 recessed cool white 6000k mini recessed Luminaires . An effective source of ambient low level guide decorative lighting. Areas for installation include, home and garden decking, under cabinet, shelf, kitchen plinth, stairways and low level ground or wall guide lighting",
//    numberAvailable: 17,
//    properties: {},
//    isActive: true,
//    categoryId: "LIGHTING",
//    producerId: "PHILIPS",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "KnightsBridge IP20 38W 2D HF Bulkhead with Opal Diffuser and White Base",
//    image: "https://i.ibb.co/nsRyx0m/4722.jpg",
//    gallery: ["https://i.ibb.co/nsRyx0m/4722.jpg"],
//    price: 43.20,
//    description:
//      "IP20 38 Watt High-Frequency Round Bulkhead c/w Opal Diffuser and White Base. 2D 38 Watt 3500k 4-pin lamp supplied (replacement lamp product code 2D38W4P).High-frequency electronic ballast.Power factor rating of 0.9.Electrical termination via 15 Amp connector block c/w cord grip.Overall diameter 410mm, overall depth 110mm.Non-dimmable. 1 Year Warranty",
//    numberAvailable: 36,
//    properties: {},
//    isActive: true,
//    categoryId: "LIGHTING",
//    producerId: "PANASONIC",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Benross 50pc Warm White LED Indoor/Outdoor Display String Rope Light",
//    image: "https://i.ibb.co/0Ct0Cvf/3515.jpg",
//    gallery: ["https://i.ibb.co/Zg4cvgf/3515-1.jpg","https://i.ibb.co/0Ct0Cvf/3515.jpg"],
//    price: 12.53,
//    description:
//      "Main Features: Stylish Bulb Style Rope Light, Ideal for decoration, Warm White Glow, Low energy LEDs, 12m Cable",
//    numberAvailable: 13,
//    properties: {},
//    isActive: true,
//    categoryId: "LIGHTING",
//    producerId: "NANOCO",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "KnightsBridge R80 80W Eyeball Downlight",
//    image: "https://i.ibb.co/kBkcQr8/4580.jpg",
//    gallery: ["https://i.ibb.co/kBkcQr8/4580.jpg","https://i.ibb.co/ZK69R4T/4580-1.jpg","https://i.ibb.co/fNFQhW8/4580-2.jpg","https://i.ibb.co/VNY7vSK/4580-3.jpg"],
//    price: 7.16,
//    description:
//      "IP20 80W Mains Eyeball, Brass, Chrome and White finishes.ES/E27 230V 80 Watt max lampholder. R80 80 Watt lamp (not supplied with fitting). Double insulated fitting. Electrical termination via 2 core 1.0mm2 silicon flex cable. Outer diameter 170mm, recessed depth 100mm. 350 degrees rotation. Tilt angle 45 degrees. Cut-out 140mm. Dimmable.140mm recommended ceiling void required. Spring clip fixings with a recommended maximum ceiling thickness of 40mm.No transformer required.",
//    numberAvailable: 34,
//    properties: {},
//    isActive: true,
//    categoryId: "LIGHTING",
//    producerId: "SINO",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "ESP Aperta Wifi Door Bell Station with Record Facility",
//    image: "https://i.ibb.co/FbR5X1C/4089.jpg",
//    gallery: ["https://i.ibb.co/FbR5X1C/4089.jpg","https://i.ibb.co/8j16jVr/4089-1.jpg","https://i.ibb.co/hVPPf0T/4089-2.jpg"],
//    price: 95.20,
//    description:
//      "Requires Wi-Fi or 4G, The users smartphone must be connected to the Wi-Fi network for programming.The WiFi Door Station allows you to view and talk to visitors at your home whether you are on the premises or on the other side of the world.From a smartphone or tablet and using the free ESP app, property owners can easily see who is at the door or gate, engage in two-way communication and allow remote access if desired.",
//    numberAvailable: 14,
//    properties: {},
//    isActive: true,
//    categoryId: "WIRING",
//    producerId: "INAX",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Timeguard Boostmaster 4 Hour Electronic Boost Timer (2019 Model)",
//    image: "https://i.ibb.co/T1CmFRk/5315.jpg",
//    gallery: ["https://i.ibb.co/T1CmFRk/5315.jpg"],
//    price: 17.46,
//    description:
//      "Technical Specification: Timer Mode: Boost, Contact Type: Normally Open, Setting Type: Digital , Operating Voltage: 230V 50Hz, Switch Rating 230V AC: 13A Resistive (3kW), 1000W Filament lighting, 500W Fluorescent lighting, 100W CFL or LED lighting, Operating Temperature: 0 to 45°C,Cable Connection: 1.5 x 2.5mm Flexible Cable EC Directives: Conforms to Latest Directives Dimensions: Width 85mm, Height 85mm, Depth 31mm",
//    numberAvailable: 36,
//    properties: {},
//    isActive: true,
//    categoryId: "WIRING",
//    producerId: "SANWA",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Eterna External Outdoor 180° Adjustable PIR Detector",
//    image: "https://i.ibb.co/gtLbwMN/2993.jpg",
//    gallery: ["https://i.ibb.co/gtLbwMN/2993.jpg","https://i.ibb.co/mNnqtMS/2993-1.jpg","https://i.ibb.co/TTfNmS3/2993-2.jpg"],
//    price: 11.13,
//    description:
//      "Main Features: Vertically & horizontally adjustable detector , Adjustable LUX level, Box Contains: External PIR Detector, Installation Guide & Mounting Fixtures, Adjustable Duration ",
//    numberAvailable: 40,
//    properties: {},
//    isActive: true,
//    categoryId: "WIRING",
//    producerId: "SONHO",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "ESP Aperta EZ-TAG3 Pro Proximity Key Tag & Keypad Door Entry Kit",
//    image: "https://i.ibb.co/b1qknD4/2828.jpg",
//    gallery: ["https://i.ibb.co/b1qknD4/2828.jpg"],
//    price: 136.39,
//    description:
//      "Main Features: Easy install, Simple self contained programming, Fail safe or secure options from power supply, Combined keypad and controller, Weatherproof IP55 rated,Durable Metal Construction,Backlit Blue LED Keypad,Activation Notification LED,Complete with 10 tags",
//    numberAvailable: 23,
//    properties: {},
//    isActive: true,
//    categoryId: "SECURITY",
//    producerId: "BLACKSPUR",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Kasp High Security Steel Shackless Padlock 73mm",
//    image: "https://i.ibb.co/18yDmqj/3356.jpg",
//    gallery: ["https://i.ibb.co/18yDmqj/3356.jpg","https://i.ibb.co/W3MVQ8T/3356-1.jpg"],
//    price: 21.43,
//    description:
//      "Main Features:Chrome plated hardened steel body which provides extra strength and protection from corrosion. Shrouded steel shackle for maximum protection against hacksaw and cropping attacks.6 pin cylinder for extra protection against picking.Corrosion resistant mechanism for reliability in potentially harsh environments.Zinc plated heavy duty steel construction for extra strength and protection against corrosion.Supplied complete fixing bolts for security and convenience.-Two keys are supplied with each lock.",
//    numberAvailable: 27,
//    properties: {},
//    isActive: true,
//    categoryId: "SECURITY",
//    producerId: "CQR",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Kasp Combination Lock 50mm Open Shackle Security Padlock",
//    image: "https://i.ibb.co/LzwwPBf/1189.jpg",
//    gallery: ["https://i.ibb.co/LzwwPBf/1189.jpg","https://i.ibb.co/c8YkC1J/1189-1.jpg"],
//    price: 14.07,
//    description:
//      "The weather resistant electro-plated lock body with rust free internal components and dual drainage system ensures that the Kasp 117 series is ideal for outdoor use, whilst offering the convenience of a keyless locking mechanism allowing the code to be set to a memorable number of choice.With its heavy weight hardened steel lock body, supertough molybdenum steel shackle and anti manipulation locking mechanism, This Kasp 117 series padlock is amongst the most secure combination padlocks available today.",
//    numberAvailable: 20,
//    properties: {},
//    isActive: true,
//    categoryId: "SECURITY",
//    producerId: "ESP",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Ener-J WiFi Smart Door Lock Left Handles (Black, Silver)",
//    image: "https://i.ibb.co/FW5tfBV/4234.jpg",
//    gallery: ["https://i.ibb.co/FW5tfBV/4234.jpg","https://i.ibb.co/r7nMCjy/4234-1.jpg","https://i.ibb.co/1shc0BG/4234-2.jpg","https://i.ibb.co/42y1H2S/4234-3.jpg","https://i.ibb.co/rw170Rb/4234-5.jpg"],
//    price: 154.93,
//    description:
//      "FIVE WAYS TO UNLOCK - ENER-Js Smart Door Lock will automatically relock after every time the door is used. Approved guests can unlock using fingerprint, ENERJSMART app, user password, RFID card and mechanical key; Support up to 3 master code,100 fingerprints and/or 100 RFID cards (Recommended Operating Temperature: >= -13?). Doorbell function, voice guide for easier and more convenient use. Suitable for 35-100mm door thickness.ENERJSMART APP MONITOR ACCESS REMOTELY - The ENERJSMART app is designed for IOS and Android devices and gives you easy door access and tracking abilities. You can view the access logs in the app for detailed information about who has opened your door, at what times, and how they gained access.",
//    numberAvailable: 26,
//    properties: {},
//    isActive: true,
//    categoryId: "SECURITY",
//    producerId: "KNIGHT",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Focal Point Panoramic White Electric Fire Suite",
//    image: "https://i.ibb.co/phWy3SS/5088.jpg",
//    gallery: ["https://i.ibb.co/phWy3SS/5088.jpg","https://i.ibb.co/rc5hjfR/5088-1.jpg","https://i.ibb.co/YcVhG8d/5088-4.jpg","https://i.ibb.co/f8P57XQ/5088-7.jpg"],
//    price: 277.81,
//    description:
//      "Features:3 Year Guarantee,2.0kW Heat Output,Fittings & fixings Included,Stones,No chimney or flue required,Flame can be used independently of heat,Thermal overload cut-out,Replaceable LED strip",
//    numberAvailable: 15,
//    properties: {},
//    isActive: true,
//    categoryId: "HEATING",
//    producerId: "TIENPHONG",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Dimplex FX20VE 2kW Electric Downflow Fan Heater",
//    image: "https://i.ibb.co/DCjLth7/3979.jpg",
//    gallery: ["https://i.ibb.co/DCjLth7/3979.jpg","https://i.ibb.co/vP61PzP/3979-1.jpg","https://i.ibb.co/tsDh1R8/3979-4.jpg"],
//    price: 39.74,
//    description:
//      "The FX20VE features an energy-saving electronic timer which automatically switches heater off after a 30 minute period to prevent it being left on accidentally.With their compact design, FX downflow fan heaters are the popular choice for heating bathrooms and en suites as well as kitchens.The powerful 2kW output ensures a fast warm up, although 1kW output is selectable on installation for smaller rooms.All models have visual on/off indicator, full safety protection and are simple to install.",
//    numberAvailable: 10,
//    properties: {},
//    isActive: true,
//    categoryId: "HEATING",
//    producerId: "CAESAR",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Silent Night Tower PTC 2000W Ceramic Heater",
//    image: "https://i.ibb.co/S0PBkTy/5430.jpg",
//    gallery: ["https://i.ibb.co/S0PBkTy/5430.jpg","https://i.ibb.co/gdN34Q9/5430-1.jpg"],
//    price: 35.99,
//    description:
//      "Features: Adjustable Thermostat: 3 Heat Settings - Cool, Warm, and Hot,Safety Overheat Protection,Low Energy Heater,360° Tip Over Switch Inside",
//    numberAvailable: 28,
//    properties: {},
//    isActive: true,
//    categoryId: "HEATING",
//    producerId: "UPVC",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Focal Point ES2000 Electric Stove with Log Flame Effect",
//    image: "https://i.ibb.co/X5ygWBV/5085.jpg",
//    gallery: ["https://i.ibb.co/X5ygWBV/5085.jpg","https://i.ibb.co/nm5k3TB/5085-1.jpg","https://i.ibb.co/k561TtX/5085-5.jpg","https://i.ibb.co/vvySCTw/5085-4.jpg"],
//    price: 116.67,
//    description:
//      "Available in Black, Cream, Grey, or Burgundy,3 Year Guarantee,1.85kW Heat Output,100% Efficient,Flame-effect only setting - without heat,LED technology - low energy flame effect,Adjustable brightness control,Easy to install",
//    numberAvailable: 24,
//    properties: {},
//    isActive: true,
//    categoryId: "HEATING",
//    producerId: "HDPE",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Garland Multi Drawer Cabinet",
//    image: "https://i.ibb.co/YWvqyGv/4798.jpg",
//    gallery: ["https://i.ibb.co/YWvqyGv/4798.jpg","https://i.ibb.co/K7DD5yt/4798-1.jpg","https://i.ibb.co/zrhjYQr/4798-7.jpg"],
//    price: 6.92,
//    description:
//      "Choose from 16, 20, 30 or 40 Drawers Ideal for storing your odds and ends like screws, bolts, nails, small parts, fixings etc, Or for storing your craft materials.The cabinet is made from tough and durable plastic, so it will last for years.Ideal for the home, garage or shed Great for your hobby craft sewing stuff Wall mountable Black cabinet with clear drawers",
//    numberAvailable: 19,
//    properties: {},
//    isActive: true,
//    categoryId: "TOOLS",
//    producerId: "GARLAND",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "C.K Redline VDE 180mm Combicutter 3 MAX",
//    image: "https://i.ibb.co/w0s2Bzn/3303.png",
//    gallery: ["https://i.ibb.co/w0s2Bzn/3303.png"],
//    price: 28.23,
//    description:
//      "Main Features:Cutting capacity: hard wire 1.8mm, medium hard wire  2.5mm, soft wire  4mm dia.Wire stripping notches for effortless and damage free strippingWire bending anvil for quick and damage free doubling back of copper wire.Pattress screw shear for damage free cutting of 3.5mm pattress screws. Cuts screws to length without damaging threads.",
//    numberAvailable: 13,
//    properties: {},
//    isActive: true,
//    categoryId: "TOOLS",
//    producerId: "BINHMINH",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "Brennenstuhl Moisture Meter MD ",
//    image: "https://i.ibb.co/hc9kCbf/5192.jpg",
//    gallery: ["https://i.ibb.co/hc9kCbf/5192.jpg"],
//    price: 13.03,
//    description:
//      "To determine the moisture content of wood or building material, such as e.g. concrete, brick, screed, plasterboard, wallpaper, etc.Measurement range of 5 - 50 % for wood, or 1.5 - 33 % for building material.Display on a large LCD display (in percent, resolution 0.1 %) as well as acoustically (can be deactivated).Practical 'hold' function also makes measurement possible at locations difficult to access.Automatic switch-off approx. 3 mins, after the last application.Battery low voltage display.Robust, ergonomic housing with a separate compartment for 9 V monobloc battery (not included).With a protective cap.In colourful display-packaging.",
//    numberAvailable: 25,
//    properties: {},
//    isActive: true,
//    categoryId: "TOOLS",
//    producerId: "EDISON",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "C.K Screwdriver Set - 7 Piece",
//    image: "https://i.ibb.co/18S11s0/4963.jpg",
//    gallery: ["https://i.ibb.co/18S11s0/4963.jpg"],
//    price: 34.76,
//    description:
//      "Key FeaturesVDE approved for safe live working up to 1000v.Premium quality Chrome Vanadium steel blade.Long fine neck for precise fingertip control.Tip type marking for easy identification.Precision machined tip",
//    numberAvailable: 29,
//    properties: {},
//    isActive: true,
//    categoryId: "TOOLS",
//    producerId: "EDISON",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
// {
//    nameProduct: "C.K High Visibility Steel Claw Hammer",
//    image: "https://i.ibb.co/41VF2Rz/3327.jpg",
//    gallery: ["https://i.ibb.co/41VF2Rz/3327.jpg"],
//    price: 7.96,
//    description:
//      "Main Features:Drop forged high carbon steel head, hardened and tempered – strong and durable. Steel shafted. Highly coloured rubber grip – for visibility and comfort. Coated and lacquered for protection",
//    numberAvailable: 22,
//    properties: {},
//    isActive: true,
//    categoryId: "TOOLS",
//    producerId: "ASHLEY",
//    createdAt: "2019-12-05T15:35:02.383Z",
//    updatedAt: "2019-12-29T07:43:07.318Z",
//  },
];
 
// const dataExchanged = [
//   {
//     reqUserName: 3,
//     recUserName: 4,
//     pName: "Iphone",
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     reqUserName: 4,
//     recUserName: 5,
//     pName: "Tablet",
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     reqUserName: 3,
//     recUserName: 4,
//     pName: "Macbook",
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// ];
 
const StoreData = [
  {
    storeName: "StoreA",
    lat: 10.7679886,
    lng: 106.667047,
    address: "",
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    lat: 10.823137690869315,
    lng: 106.62967162611417,
    address: "",
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreC",
    lat: 10.7675005,
    lng: 106.6715276,
    address: "",
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
]

const OwnershipData = [
//========================== Zexum 0.75mm 3 Core PVC Flex Cable White Round 2183Y ====================================
  {
    storeName: "StoreA",
    pId: 1,
    quantity: 3,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 1,
    quantity: 4,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreC",
    pId: 1,
    quantity: 6,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
//========================== Zexum 16mm 5 Core 96A 6945X Steel Wire ====================================
  {
    storeName: "StoreA",
    pId: 2,
    quantity: 3,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 2,
    quantity: 1,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreC",
    pId: 2,
    quantity: 13,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
//========================== KnightsBridge T4 Under Cabinet Linkable Fluorescent ====================================
  {
    storeName: "StoreA",
    pId: 3,
    quantity: 4,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 3,
    quantity: 8,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreC",
    pId: 3,
    quantity: 5,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
//========================== Eterna LED Corner Wall Body Outside Light Fitting ====================================
  {
    storeName: "StoreA",
    pId: 4,
    quantity: 3,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 4,
    quantity: 2,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreC",
    pId: 4,
    quantity: 5,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
//========================== Burco Cygnet 10L Electric Water Boiler - Stainless Steel ====================================
  {
    storeName: "StoreA",
    pId: 5,
    quantity: 9,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 5,
    quantity: 3,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreC",
    pId: 5,
    quantity: 3,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
//========================== Tagu PowerFlame 23 Inch Electric Fire ====================================
  {
    storeName: "StoreA",
    pId: 6,
    quantity: 4,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 6,
    quantity: 4,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreC",
    pId: 6,
    quantity: 4,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
// //========================== Zexum Deluxe IEC UK Mains Adapter Trailing Socket Lead with Neon ====================================
//   {
//     storeName: "StoreA",
//     pId: 7,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 7,
//     quantity: 3,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 7,
//     quantity: 18,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Zexum Black RJ45 Cat6 High Quality Stranded Snagless UTP Ethernet Network LAN Patch Cable ==========
//   {
//     storeName: "StoreA",
//     pId: 8,
//     quantity: 23,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 8,
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 8,
//     quantity: 7,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Sealey 7 Core 0.75mm Thin Wall Automotive Cable - 30 Meter ====================================
//   {
//     storeName: "StoreA",
//     pId: 9,
//     quantity: 4,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 9,
//     quantity: 11,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 9,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== KnightsBridge 230V IP65 10 x 0.2w Cool White LED Kit 6000K ====================================
//   {
//     storeName: "StoreA",
//     pId: 10,
//     quantity: 16,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 10,
//     quantity: 19,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 10,
//     quantity: 12,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== KnightsBridge IP20 38W 2D HF Bulkhead with Opal Diffuser and White Base ========================
//   {
//     storeName: "StoreA",
//     pId: 11,
//     quantity: 9,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 11,
//     quantity: 15,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 11,
//     quantity: 12,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Benross 50pc Warm White LED Indoor/Outdoor Display String Rope Light ====================================
//   {
//     storeName: "StoreA",
//     pId: 12,
//     quantity: 10,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 12,
//     quantity: 2,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 12,
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== KnightsBridge R80 80W Eyeball Downlight ====================================
//   {
//     storeName: "StoreA",
//     pId: 13,
//     quantity: 14,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 13,
//     quantity: 15,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 13,
//     quantity: 5,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== ESP Aperta Wifi Door Bell Station with Record Facility ====================================
//   {
//     storeName: "StoreA",
//     pId: 14,
//     quantity: 7,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 14,
//     quantity: 7,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 14,
//     quantity: 0,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Timeguard Boostmaster 4 Hour Electronic Boost Timer (2019 Model) ====================================
//   {
//     storeName: "StoreA",
//     pId: 15,
//     quantity: 3,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 15,
//     quantity: 25,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 15,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Eterna External Outdoor 180° Adjustable PIR Detector ====================================
//   {
//     storeName: "StoreA",
//     pId: 16,
//     quantity: 11,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 16,
//     quantity: 7,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 16,
//     quantity: 22,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== ESP Aperta EZ-TAG3 Pro Proximity Key Tag & Keypad Door Entry Kit ====================================
//   {
//     storeName: "StoreA",
//     pId: 17,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 17,
//     quantity: 5,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 17,
//     quantity: 10,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Kasp High Security Steel Shackless Padlock 73mm ====================================
//   {
//     storeName: "StoreA",
//     pId: 18,
//     quantity: 5,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 18,
//     quantity: 17,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 18,
//     quantity: 5,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Kasp Combination Lock 50mm Open Shackle Security Padlock ====================================
//   {
//     storeName: "StoreA",
//     pId: 19,
//     quantity: 4,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 19,
//     quantity: 11,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 19,
//     quantity: 5,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Ener-J WiFi Smart Door Lock Left Handles (Black, Silver) ====================================
//   {
//     storeName: "StoreA",
//     pId: 20,
//     quantity: 6,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 20,
//     quantity: 4,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 20,
//     quantity: 16,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Focal Point Panoramic White Electric Fire Suite ====================================
//   {
//     storeName: "StoreA",
//     pId: 21,
//     quantity: 11,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 21,
//     quantity: 3,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 21,
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Dimplex FX20VE 2kW Electric Downflow Fan Heater ====================================
//   {
//     storeName: "StoreA",
//     pId: 22,
//     quantity: 6,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 22,
//     quantity: 2,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 22,
//     quantity: 2,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Silent Night Tower PTC 2000W Ceramic Heater ====================================
//   {
//     storeName: "StoreA",
//     pId: 23,
//     quantity: 26,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 23,
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 23,
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Focal Point ES2000 Electric Stove with Log Flame Effect ====================================
//   {
//     storeName: "StoreA",
//     pId: 24,
//     quantity: 1,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 24,
//     quantity: 12,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 24,
//     quantity: 11,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Garland Multi Drawer Cabinet ====================================
//   {
//     storeName: "StoreA",
//     pId: 25,
//     quantity: 11,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 25,
//     quantity: 0,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 25,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== C.K Redline VDE 180mm Combicutter 3 MAX ====================================
//   {
//     storeName: "StoreA",
//     pId: 26,
//     quantity: 5,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 26,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 26,
//     quantity: 0,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== Brennenstuhl Moisture Meter MD ====================================
//   {
//     storeName: "StoreA",
//     pId: 27,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 27,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 27,
//     quantity: 9,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== C.K Screwdriver Set - 7 Piece ====================================
//   {
//     storeName: "StoreA",
//     pId: 28,
//     quantity: 9,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 28,
//     quantity: 13,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 28,
//     quantity: 7,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
// //========================== C.K High Visibility Steel Claw Hammer ====================================
//   {
//     storeName: "StoreA",
//     pId: 29,
//     quantity: 8,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreB",
//     pId: 29,
//     quantity: 5,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
//   {
//     storeName: "StoreC",
//     pId: 29,
//     quantity: 9,
//     createdAt: "2019-12-05T15:03:11.311Z",
//     updatedAt: "2019-12-05T15:08:15.904Z",
//   },
];


exports.seed = async function (knex, prom) {
 const users = await Models.User.query();
 if(users.length === 0) {
 await Models.Role.query().delete();
 await Models.User.query().delete();
 await Models.Category.query().delete();
 await Models.Producer.query().delete();
 await Models.Product.query().delete();
   console.log(111111111111111);
 const roles = await Models.Role.query().insert(dataRole).returning("*");
  const newUsers = dataUser.map((e) => {
  //  e.roleId = roles.find((i) => i.nameRole === e.name).id;
   e.password = PasswordUtils.hashSync("123456");
   return e;
 });
 await Models.User.query().insert(newUsers);
 
 const categories = await Models.Category.query()
   .insert(dataCategory)
   .returning("*");
 const newProducers = dataProducer.map((e) => {
   e.categoryId = categories.find((i) => i.nameCategory === e.categoryId).id;
   return e;
 });
 const producers = await Models.Producer.query()
   .insert(newProducers)
   .returning("*");
 
 const newProducts = dataProduct.map((e) => {
   e.categoryId = categories.find((i) => i.nameCategory === e.categoryId).id;
   e.producerId = producers.find((i) => i.name === e.producerId).id;
   return e;
 });
 await Models.Product.query().insert(newProducts); 
 // await Models.Exchanged.query().insert(dataExchanged);
 await Models.Store.query().insert(StoreData).returning("*");
 await Models.Ownership.query().insert(OwnershipData).returning("*");
}
return 1;
};
 
 
 