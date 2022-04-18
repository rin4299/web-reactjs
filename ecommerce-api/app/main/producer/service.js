'use strict';

const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const { Model } = require('objection');

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

class ProducerService extends BaseServiceCRUD {
  constructor() {
    super(Models.Producer, 'Producer');
  }
  async initProducer(){
    for (var i = 0; i < dataProducer.length; i++){
      await Models.Producer.query().update({image:dataProducer[i].image}).where('name',dataProducer[i].name)
    }
    return 'successful'
  }

  async getMany(query) {
    const builder = this.model.queryBuilder(query).eager('categories');
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
  }


  async getManyByCategoryId(query, id) {
    const builder = this.model.queryBuilder(query).eager('categories')
      .where('categoryId', id)
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
  }

  getSearchQuery(builder, q) {
    builder.andWhere(function () {
      this.whereRaw('LOWER("name") LIKE \'%\' || LOWER(?) || \'%\' ', q);
    });
  }
}

module.exports = ProducerService;
