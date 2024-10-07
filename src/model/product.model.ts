import mongoose, { Document, Schema } from 'mongoose';

// Define an interface that represents the shape of the document
interface Product extends Document {
  eBay: string;
  etsy: string;
  refId: string | null;
  amazon: string;
  bstone: string | null;
  jaipur: string;
  metaKw: string;
  status: string;
  urlKey: string;
  cutName: string | null;
  discPct: number;
  eBayTxt: string | null;
  etsyTxt: string | null;
  fjStone: string | null;
  prodSku: string;
  reqWire: string | null;
  wghtCts: number;
  fancyCut: string;
  fjBigNbr: string | null;
  gCatsEye: string;
  jewelBox: string;
  metaDesc: string;
  position: number;
  prodDesc: string;
  prodName: string;
  rsOption: string;
  saveType: string;
  soldTime: Date | string; // Consider changing to Date if using Date objects
  stoneHgt: number;
  stoneLen: number;
  updateBy: string;
  updateIp: string;
  updateTs: Date;
  vaultGem: string;
  amazonTxt: string | null;
  clearance: string | null;
  etsyStock: string | null;
  jBandWdth: string | null;
  jRingSize: string;
  jtypeBail: string | null;
  matalWght: number;
  metaTitle: string;
  metalType: string;
  packaging: string | null;
  piecesCnt: number;
  prodPrice: number;
  prodStock: number;
  sessionId: string;
  shapeName: string;
  shapeSize: string | null;
  sortPrice: number;
  stoneDpth: number;
  stoneWdth: number;
  annivStone: string | null;
  barcodeNbr: string | null;
  gStarStone: string;
  gsHardness: string | null;
  jBandThick: string | null;
  matalColor: string;
  newArrival: number;
  originName: string | null;
  searchCat3: string | null;
  clarityName: string | null;
  dealOfMonth: string;
  diamondWght: number;
  jDimBaiILen: number;
  metalPurity: string;
  searchColor: string | null;
  styleNumber: string | null;
  transparent: string | null;
  viewCounter: number;
  ytEmbedCode: string | null;
  categoryName: string;
  chemicalComp: string | null;
  etsyCategory: string | null;
  fjStonePrice: number;
  gemstoneName: string | null;
  gemstoneType: string | null;
  jDimBaiIDpth: number;
  jDimBaiIWdth: number;
  alwaysInStock: number;
  etsyListingId: string | null;
  jTypeBackings: string | null;
  masterCutName: string | null;
  personalNotes: string | null;
  searchTagsFor: string | null;
  totalPieceLen: number;
  treatmentName: string | null;
  accentstoneCnt: number;
  centerstoneLen: number;
  diamondClarity: string | null;
  jBackingsStyle: string | null;
  metalColorName: string;
  outOfStockSale: number;
  prodMetalColor: {
    images: {
      status: string;
      image_id: number;
      position: number;
      dfltImage: string;
      cropCoords: string | null;
      imageFileName: string;
    }[];
    status: string;
    position: number;
    prodColorSku: string;
    prodColorStock: number;
  }[];
  totalPieceDpth: number;
  totalPieceWdth: number;
  centerstoneWdth: number;
  etsyShopSection: string | null;
  jTypeBackingsId: string | null;
  otherCommentTxt: string | null;
  subCategoryName: string;
  centerstoneDepth: number;
  colorChangeStone: string;
  diamondColorName: string | null;
}

// Define the schema
const ProductSchema: Schema = new Schema({
  eBay: { type: String, required: true },
  etsy: { type: String, required: true },
  refId: { type: String, default: null },
  amazon: { type: String, required: true },
  bstone: { type: String, default: null },
  jaipur: { type: String, required: true },
  metaKw: { type: String, required: true },
  status: { type: String, required: true },
  urlKey: { type: String, required: true },
  cutName: { type: String, default: null },
  discPct: { type: Number, required: true },
  eBayTxt: { type: String, default: null },
  etsyTxt: { type: String, default: null },
  fjStone: { type: String, default: null },
  prodSku: { type: String, required: true },
  reqWire: { type: String, default: null },
  wghtCts: { type: Number, default: 0 },
  fancyCut: { type: String, required: true },
  fjBigNbr: { type: String, default: null },
  gCatsEye: { type: String, required: true },
  jewelBox: { type: String, required: true },
  metaDesc: { type: String, required: true },
  position: { type: Number, required: true },
  prodDesc: { type: String, required: true },
  prodName: { type: String, required: true },
  rsOption: { type: String, required: true },
  saveType: { type: String, required: true },
  soldTime: { type: Date, default: new Date('1000-01-01T00:00:00') },
  stoneHgt: { type: Number, default: 0 },
  stoneLen: { type: Number, default: 0 },
  updateBy: { type: String, required: true },
  updateIp: { type: String, required: true },
  updateTs: { type: Date, required: true },
  vaultGem: { type: String, required: true },
  amazonTxt: { type: String, default: null },
  clearance: { type: String, default: null },
  etsyStock: { type: String, default: null },
  jBandWdth: { type: String, default: null },
  jRingSize: { type: String, required: true },
  jtypeBail: { type: String, default: null },
  matalWght: { type: Number, required: true },
  metaTitle: { type: String, required: true },
  metalType: { type: String, required: true },
  packaging: { type: String, default: null },
  piecesCnt: { type: Number, default: 0 },
  prodPrice: { type: Number, required: true },
  prodStock: { type: Number, required: true },
  sessionId: { type: String, required: true },
  shapeName: { type: String, required: true },
  shapeSize: { type: String, default: null },
  sortPrice: { type: Number, required: true },
  stoneDpth: { type: Number, default: 0 },
  stoneWdth: { type: Number, default: 0 },
  annivStone: { type: String, default: null },
  barcodeNbr: { type: String, default: null },
  gStarStone: { type: String, required: true },
  gsHardness: { type: String, default: null },
  jBandThick: { type: String, default: null },
  matalColor: { type: String, required: true },
  newArrival: { type: Number, required: true },
  originName: { type: String, default: null },
  searchCat3: { type: String, default: null },
  clarityName: { type: String, default: null },
  dealOfMonth: { type: String, required: true },
  diamondWght: { type: Number, required: true },
  jDimBaiILen: { type: Number, default: 0 },
  metalPurity: { type: String, required: true },
  searchColor: { type: String, default: null },
  styleNumber: { type: String, default: null },
  transparent: { type: String, default: null },
  viewCounter: { type: Number, required: true },
  ytEmbedCode: { type: String, default: null },
  categoryName: { type: String, required: true },
  chemicalComp: { type: String, default: null },
  etsyCategory: { type: String, default: null },
  fjStonePrice: { type: Number, required: true },
  gemstoneName: { type: String, default: null },
  gemstoneType: { type: String, default: null },
  jDimBaiIDpth: { type: Number, default: 0 },
  jDimBaiIWdth: { type: Number, default: 0 },
  alwaysInStock: { type: Number, required: true },
  etsyListingId: { type: String, default: null },
  jTypeBackings: { type: String, default: null },
  masterCutName: { type: String, default: null },
  personalNotes: { type: String, default: null },
  searchTagsFor: { type: String, default: null },
  totalPieceLen: { type: Number, required: true },
  treatmentName: { type: String, default: null },
  accentstoneCnt: { type: Number, required: true },
  centerstoneLen: { type: Number, required: true },
  diamondClarity: { type: String, default: null },
  jBackingsStyle: { type: String, default: null },
  metalColorName: { type: String, required: true },
  outOfStockSale: { type: Number, required: true },
  prodMetalColor: [
    {
      images: [
        {
          status: { type: String, required: true },
          image_id: { type: Number, required: true },
          position: { type: Number, required: true },
          dfltImage: { type: String, required: true },
          cropCoords: { type: String, default: null },
          imageFileName: { type: String, required: true },
        },
      ],
      status: { type: String, required: true },
      position: { type: Number, required: true },
      prodColorSku: { type: String, required: true },
      prodColorStock: { type: Number, required: true },
    },
  ],
  totalPieceDpth: { type: Number, required: true },
  totalPieceWdth: { type: Number, required: true },
  centerstoneWdth: { type: Number, required: true },
  etsyShopSection: { type: String, default: null },
  jTypeBackingsId: { type: String, default: null },
  otherCommentTxt: { type: String, default: null },
  subCategoryName: { type: String, required: true },
  centerstoneDepth: { type: Number, required: true },
  colorChangeStone: { type: String, required: true },
  diamondColorName: { type: String, default: null },
});

// Create the model
const ProductModel = mongoose.model<Product>('product', ProductSchema);

export default ProductModel;
