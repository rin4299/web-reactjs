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
   email: "admin@gmail.com",
   name: "admin",
   roleId: 1,
   isVerifyEmail: true,
 },
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
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "PANASONIC",
   categoryId: "LIGHTING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "NANOCO",
   categoryId: "LIGHTING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "SINO",
   categoryId: "LIGHTING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "DUHAL",
   categoryId: "LIGHTING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "CADI-SUN",
   categoryId: "CABLING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
{
   name: "TACHIKO",
   categoryId: "CABLING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "TAESUNG",
   categoryId: "CABLING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "HDPE",
   categoryId: "CABLING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "LIOA",
   categoryId: "CABLING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "SANWA",
   categoryId: "WIRING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "INAX",
   categoryId: "WIRING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "SONHO",
   categoryId: "WIRING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "TOTO",
   categoryId: "WIRING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "ARISTON",
   categoryId: "WIRING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "TIENPHONG",
   categoryId: "HEATING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "CAESAR",
   categoryId: "HEATING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "HDPE",
   categoryId: "HEATING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "REHAU",
   categoryId: "HEATING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "UPVC",
   categoryId: "HEATING",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "GARLAND",
   categoryId: "TOOLS",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "BINHMINH",
   categoryId: "TOOLS",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "EDISON",
   categoryId: "TOOLS",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "ASHLEY",
   categoryId: "TOOLS",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "AVIT",
   categoryId: "TOOLS",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "BLACKSPUR",
   categoryId: "SECURITY",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "CQR",
   categoryId: "SECURITY",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "ESP",
   categoryId: "SECURITY",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
 },
 {
   name: "KNIGHT",
   categoryId: "SECURITY",
   isActive: true,
   image: "https://via.placeholder.com/300x300.png",
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
   numberAvailable: 27,
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
   numberAvailable: 19,
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
   numberAvailable: 35,
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
   numberAvailable: 22,
   properties: {},
   isActive: true,
   categoryId: "HEATING",
   producerId: "CAESAR",
   createdAt: "2019-12-05T15:56:00.394Z",
   updatedAt: "2019-12-29T07:24:29.343Z",
 },
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
    lat: 10.82302,
    lng: 106.62965,
    address: "",
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
]

const OwnershipData = [
  {
    storeName: "StoreA",
    pId: 1,
    quantity: 7,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 1,
    quantity: 6,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreA",
    pId: 2,
    quantity: 10,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 2,
    quantity: 7,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreA",
    pId: 3,
    quantity: 12,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 3,
    quantity: 15,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreA",
    pId: 4,
    quantity: 11,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 4,
    quantity: 8,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreA",
    pId: 5,
    quantity: 24,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreB",
    pId: 5,
    quantity: 11,
    createdAt: "2019-12-05T15:03:11.311Z",
    updatedAt: "2019-12-05T15:08:15.904Z",
  },
  {
    storeName: "StoreA",
    pId: 6,
    quantity: 18,
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
 
 
 

