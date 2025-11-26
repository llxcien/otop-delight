export interface Product {
  _id: string;   // <--- สำคัญมาก
  name: string;
  province: string;
  community: string;
  category: string;
  description: string;
  rating: number;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string;
}


export interface CartItem extends Product {
  quantity: number;
}

