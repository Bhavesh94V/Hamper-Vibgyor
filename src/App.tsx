import React, { useEffect, useRef, useState } from 'react';
import { Gift, Heart, Star, ShoppingCart, ArrowRight, Package, Sparkles, Crown, X, Plus, Minus, Truck, Shield, RotateCcw, Award, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Hamper {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  badge: string;
  category: string;
  contents: string[];
  features: string[];
  gallery: string[];
  story: string;
  ingredients: string[];
  nutritionalInfo: { [key: string]: string };
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const [selectedHamper, setSelectedHamper] = useState<Hamper | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Three.js setup
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create floating particles with different sizes and colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 15;
      
      // Golden color variations
      const golden = new THREE.Color(0xb89433);
      const copper = new THREE.Color(0xc87c38);
      const color = golden.lerp(copper, Math.random());
      
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
      
      sizeArray[i / 3] = Math.random() * 0.02 + 0.005;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.01,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add floating geometric shapes
    const geometries = [
      new THREE.OctahedronGeometry(0.1),
      new THREE.TetrahedronGeometry(0.08),
      new THREE.IcosahedronGeometry(0.06),
    ];

    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: 0xb89433,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });

    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const shape = new THREE.Mesh(geometry, shapeMaterial);
      shape.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      shapes.push(shape);
      scene.add(shape);
    }

    camera.position.z = 5;

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.001;
      
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 + index * 0.001;
        shape.rotation.y += 0.008 + index * 0.0008;
        shape.position.y += Math.sin(time + index) * 0.002;
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // GSAP Animations
    gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 2,
      }
    })
    .to(particlesMesh.rotation, { y: Math.PI * 3, duration: 3 })
    .to(camera.position, { z: 8, duration: 3 }, 0);

    // Enhanced product cards animation
    gsap.fromTo('.product-card', {
      y: 120,
      opacity: 0,
      scale: 0.7,
      rotationX: 15,
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotationX: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: productsRef.current,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none reverse',
      }
    });

    // Parallax sections
    gsap.utils.toArray('.parallax-section').forEach((section: any) => {
      gsap.fromTo(section, {
        y: 100,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const hampers: Hamper[] = [
    {
      id: 1,
      name: "Luxury Chocolate Symphony",
      image: "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "An exquisite collection of premium Belgian chocolates crafted by master chocolatiers",
      rating: 4.9,
      reviews: 256,
      badge: "Bestseller",
      category: "Chocolate",
      contents: [
        "12 Premium Belgian Dark Chocolates",
        "8 Milk Chocolate Truffles",
        "6 White Chocolate Pralines",
        "4 Artisan Chocolate Bars",
        "Luxury Gift Box with Ribbon"
      ],
      features: [
        "Handcrafted by Master Chocolatiers",
        "Premium Belgian Cocoa",
        "No Artificial Preservatives",
        "Elegant Gift Packaging"
      ],
      gallery: [
        "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      story: "Crafted in the heart of Belgium, each chocolate tells a story of tradition and excellence. Our master chocolatiers have perfected these recipes over generations.",
      ingredients: ["Premium Cocoa", "Fresh Cream", "Madagascar Vanilla", "Belgian Butter", "Organic Sugar"],
      nutritionalInfo: {
        "Calories": "520 per 100g",
        "Fat": "32g",
        "Carbs": "48g",
        "Protein": "8g",
        "Sugar": "42g"
      }
    },
    {
      id: 2,
      name: "Artisan Snack Paradise",
      image: "https://images.pexels.com/photos/1030945/pexels-photo-1030945.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "A curated selection of gourmet nuts, dried fruits, and artisanal snacks",
      rating: 4.7,
      reviews: 189,
      badge: "Premium",
      category: "Snacks",
      contents: [
        "Roasted Almonds with Sea Salt",
        "Honey Glazed Cashews",
        "Dried Turkish Apricots",
        "Dark Chocolate Covered Berries",
        "Artisan Cheese Crackers",
        "Organic Trail Mix"
      ],
      features: [
        "All Natural Ingredients",
        "No Artificial Flavors",
        "Sustainably Sourced",
        "Resealable Packaging"
      ],
      gallery: [
        "https://images.pexels.com/photos/1030945/pexels-photo-1030945.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      story: "Sourced from the finest farms around the world, each snack is carefully selected for its exceptional quality and taste.",
      ingredients: ["Organic Nuts", "Natural Honey", "Sea Salt", "Dried Fruits", "Dark Chocolate"],
      nutritionalInfo: {
        "Calories": "450 per 100g",
        "Fat": "28g",
        "Carbs": "35g",
        "Protein": "12g",
        "Fiber": "8g"
      }
    },
    {
      id: 3,
      name: "Royal Tea Collection",
      image: "https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Premium tea blends from around the world with handcrafted cookies",
      rating: 4.8,
      reviews: 324,
      badge: "Royal",
      category: "Tea & Coffee",
      contents: [
        "Earl Grey Supreme Tea",
        "Dragon Well Green Tea",
        "Himalayan Gold Black Tea",
        "Chamomile Honey Tea",
        "Handcrafted Butter Cookies",
        "Elegant Tea Infuser"
      ],
      features: [
        "Single Origin Teas",
        "Hand-picked Leaves",
        "Traditional Processing",
        "Premium Tea Accessories"
      ],
      gallery: [
        "https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      story: "From the misty mountains of Darjeeling to the ancient tea gardens of China, each blend represents centuries of tea-making tradition.",
      ingredients: ["Premium Tea Leaves", "Natural Bergamot", "Organic Honey", "Butter", "Wheat Flour"],
      nutritionalInfo: {
        "Calories": "2 per cup (tea)",
        "Antioxidants": "High",
        "Caffeine": "40-60mg",
        "Cookies": "120 per piece"
      }
    },
    {
      id: 4,
      name: "Festive Sweets Celebration",
      image: "https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Traditional Indian sweets and mithai collection for special occasions",
      rating: 4.9,
      reviews: 403,
      badge: "Festival Special",
      category: "Sweets",
      contents: [
        "Kaju Katli (Cashew Fudge)",
        "Gulab Jamun",
        "Rasgulla",
        "Badam Burfi",
        "Motichoor Laddu",
        "Silver Leaf Decoration"
      ],
      features: [
        "Traditional Recipes",
        "Pure Ghee",
        "No Artificial Colors",
        "Fresh Daily Preparation"
      ],
      gallery: [
        "https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1070855/pexels-photo-1070855.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1070853/pexels-photo-1070853.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      story: "Prepared using age-old family recipes passed down through generations, each sweet carries the essence of Indian tradition and celebration.",
      ingredients: ["Pure Milk", "Ghee", "Sugar", "Cashews", "Almonds", "Cardamom", "Rose Water"],
      nutritionalInfo: {
        "Calories": "380 per 100g",
        "Fat": "18g",
        "Carbs": "45g",
        "Protein": "8g",
        "Sugar": "40g"
      }
    },
    {
      id: 5,
      name: "Wellness Garden Hamper",
      image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Organic honey, herbal teas, and healthy snacks for wellness enthusiasts",
      rating: 4.6,
      reviews: 167,
      badge: "Organic",
      category: "Wellness",
      contents: [
        "Raw Organic Honey",
        "Turmeric Ginger Tea",
        "Green Tea with Mint",
        "Organic Granola",
        "Dried Goji Berries",
        "Herbal Wellness Guide"
      ],
      features: [
        "100% Organic",
        "No Pesticides",
        "Sustainably Sourced",
        "Health Benefits Certified"
      ],
      gallery: [
        "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      story: "Sourced from organic farms committed to sustainable practices, each product supports both your health and the environment.",
      ingredients: ["Organic Honey", "Turmeric", "Ginger", "Green Tea", "Mint", "Oats", "Goji Berries"],
      nutritionalInfo: {
        "Calories": "320 per 100g",
        "Fat": "8g",
        "Carbs": "55g",
        "Protein": "12g",
        "Fiber": "15g"
      }
    },
    {
      id: 6,
      name: "Coffee Connoisseur Collection",
      image: "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Premium coffee beans with brewing accessories for the perfect cup",
      rating: 4.8,
      reviews: 242,
      badge: "Limited Edition",
      category: "Coffee",
      contents: [
        "Ethiopian Single Origin Beans",
        "Colombian Supremo Coffee",
        "French Roast Blend",
        "Coffee Grinder",
        "French Press",
        "Brewing Guide"
      ],
      features: [
        "Single Origin Beans",
        "Freshly Roasted",
        "Fair Trade Certified",
        "Professional Equipment"
      ],
      gallery: [
        "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1251176/pexels-photo-1251176.jpeg?auto=compress&cs=tinysrgb&w=800"
      ],
      story: "From the highlands of Ethiopia to the mountains of Colombia, each bean is carefully selected and roasted to perfection by our master roasters.",
      ingredients: ["Arabica Coffee Beans", "Natural Processing", "Medium-Dark Roast"],
      nutritionalInfo: {
        "Calories": "2 per cup",
        "Caffeine": "95mg per cup",
        "Antioxidants": "High",
        "Fat": "0g"
      }
    }
  ];

  const categories = [
    { name: "Chocolate Hampers", icon: <Crown className="w-6 h-6" />, count: 25, color: "from-amber-400 to-orange-500" },
    { name: "Snack Collections", icon: <Package className="w-6 h-6" />, count: 18, color: "from-green-400 to-emerald-500" },
    { name: "Tea & Coffee", icon: <Gift className="w-6 h-6" />, count: 22, color: "from-purple-400 to-pink-500" },
    { name: "Wellness", icon: <Heart className="w-6 h-6" />, count: 14, color: "from-blue-400 to-cyan-500" },
    { name: "Festive Specials", icon: <Sparkles className="w-6 h-6" />, count: 32, color: "from-red-400 to-rose-500" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Absolutely stunning hampers! The quality exceeded my expectations and the packaging was beautiful.",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      comment: "Perfect for gifting! My family loved every item in the hamper. Will definitely order again.",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      rating: 5,
      comment: "The chocolate hamper was divine! Each piece was crafted to perfection. Highly recommended!",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  const openHamperDetail = (hamper: Hamper) => {
    setSelectedHamper(hamper);
    setQuantity(1);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeHamperDetail = () => {
    setSelectedHamper(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="relative inline-block mb-8">
              <Gift className="w-20 h-20 mx-auto mb-6 text-[#b89433] animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#c87c38] to-[#A07e7e] rounded-full animate-bounce"></div>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-[#b89433] via-[#c87c38] to-[#b89433] bg-clip-text text-transparent leading-tight">
              Exquisite
              <br />
              <span className="text-6xl md:text-8xl">Gift Hampers</span>
            </h1>
            <p className="text-2xl md:text-3xl text-[#7A7A7A] mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Thoughtfully curated collections that transform moments into memories
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group bg-gradient-to-r from-[#c87c38] to-[#A07e7e] text-white px-10 py-5 rounded-full font-semibold text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl flex items-center gap-4 transform hover:rotate-1">
              Explore Collection
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <button className="border-3 border-[#b89433] text-[#b89433] px-10 py-5 rounded-full font-semibold text-xl transition-all duration-500 hover:bg-[#b89433] hover:text-white hover:scale-105 transform hover:-rotate-1">
              Custom Hampers
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div key={index} className="group bg-white/90 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white transition-all duration-500 hover:scale-110 cursor-pointer border border-gray-100 shadow-lg hover:shadow-2xl transform hover:-translate-y-2">
                <div className={`bg-gradient-to-r ${category.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-[#3A2F25] font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-[#7A7A7A] text-sm">{category.count} premium items</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="relative z-10 py-32 px-4 parallax-section">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-[#7A7A7A] mb-6">
              Premium Collections
            </h2>
            <p className="text-2xl text-[#3A2F25] max-w-3xl mx-auto leading-relaxed">
              Each hamper tells a story of craftsmanship, quality, and the art of gifting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {hampers.map((hamper) => (
              <div key={hamper.id} className="product-card group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 border border-gray-50 relative">
                <div className="relative overflow-hidden h-80">
                  <img 
                    src={hamper.image} 
                    alt={hamper.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-6 left-6">
                    <span className="bg-gradient-to-r from-[#c87c38] to-[#A07e7e] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {hamper.badge}
                    </span>
                  </div>
                  <div className="absolute top-6 right-6">
                    <button className="bg-white/95 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:scale-110">
                      <Heart className="w-6 h-6 text-[#b89433]" />
                    </button>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <button 
                      onClick={() => openHamperDetail(hamper)}
                      className="w-full bg-white/95 backdrop-blur-sm text-[#3A2F25] py-3 rounded-full font-bold hover:bg-white transition-all duration-300 shadow-lg"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(hamper.rating) ? 'fill-[#b89433] text-[#b89433]' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-[#7A7A7A] ml-2 font-medium">({hamper.reviews} reviews)</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#3A2F25] mb-3 group-hover:text-[#b89433] transition-colors duration-300">
                    {hamper.name}
                  </h3>
                  
                  <p className="text-[#7A7A7A] text-lg mb-6 line-clamp-2 leading-relaxed">
                    {hamper.description}
                  </p>
                  
                  <div className="flex gap-4">
                    <button className="flex-1 bg-gradient-to-r from-[#c87c38] to-[#A07e7e] text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg">
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => openHamperDetail(hamper)}
                      className="border-2 border-[#b89433] text-[#b89433] px-8 py-4 rounded-full font-bold hover:bg-[#b89433] hover:text-white transition-all duration-300 hover:scale-105"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-br from-[#b89433]/5 via-white to-[#c87c38]/5 parallax-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#7A7A7A] mb-6">Why Choose Our Hampers?</h2>
            <p className="text-xl text-[#3A2F25] max-w-3xl mx-auto">Excellence in every detail, from sourcing to delivery</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Award className="w-12 h-12" />, title: "Premium Quality", desc: "Only the finest products make it into our collections" },
              { icon: <Package className="w-12 h-12" />, title: "Elegant Packaging", desc: "Beautiful presentation that makes every gift special" },
              { icon: <Truck className="w-12 h-12" />, title: "Fast Delivery", desc: "Quick and secure delivery to your doorstep" },
              { icon: <Shield className="w-12 h-12" />, title: "Quality Guarantee", desc: "100% satisfaction guaranteed or money back" }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 text-[#b89433] group-hover:scale-110 border border-gray-100">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#3A2F25] mb-4">{feature.title}</h3>
                <p className="text-[#7A7A7A] text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="relative z-10 py-32 px-4 parallax-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#7A7A7A] mb-6">What Our Customers Say</h2>
            <p className="text-xl text-[#3A2F25]">Real experiences from our valued customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:scale-105">
                <div className="flex items-center mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                  <div>
                    <h4 className="text-xl font-bold text-[#3A2F25]">{testimonial.name}</h4>
                    <p className="text-[#7A7A7A]">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#b89433] text-[#b89433]" />
                  ))}
                </div>
                <p className="text-[#3A2F25] text-lg leading-relaxed italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-r from-[#b89433]/10 to-[#c87c38]/10 parallax-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#7A7A7A] mb-6">Our Process</h2>
            <p className="text-xl text-[#3A2F25]">From selection to delivery, every step is crafted with care</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Curate", desc: "Expert selection of premium products", icon: <Crown className="w-8 h-8" /> },
              { step: "02", title: "Package", desc: "Beautiful presentation and packaging", icon: <Package className="w-8 h-8" /> },
              { step: "03", title: "Quality Check", desc: "Rigorous quality assurance", icon: <Shield className="w-8 h-8" /> },
              { step: "04", title: "Deliver", desc: "Safe and timely delivery", icon: <Truck className="w-8 h-8" /> }
            ].map((process, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-gradient-to-br from-[#c87c38] to-[#A07e7e] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-xl">
                  {process.step}
                </div>
                <div className="text-[#b89433] mb-4 flex justify-center">
                  {process.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#3A2F25] mb-3">{process.title}</h3>
                <p className="text-[#7A7A7A] text-lg">{process.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#b89433] to-transparent -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4 parallax-section">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#b89433] via-[#c87c38] to-[#A07e7e] rounded-3xl p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <Sparkles className="w-20 h-20 mx-auto mb-8 animate-pulse" />
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Create Your Perfect Hamper</h2>
              <p className="text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
                Can't find exactly what you're looking for? Let our experts create a personalized hamper tailored to your preferences
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-white text-[#b89433] px-10 py-5 rounded-full font-bold text-xl hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  Start Customizing
                </button>
                <button className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-[#b89433] transition-all duration-300">
                  Contact Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-32 px-4 bg-gradient-to-br from-gray-50 to-white parallax-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#7A7A7A] mb-6">Get in Touch</h2>
            <p className="text-xl text-[#3A2F25]">We're here to help you create the perfect gift experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-[#b89433] to-[#c87c38] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#3A2F25] mb-3">Call Us</h3>
              <p className="text-[#7A7A7A] text-lg">+91 98765 43210</p>
              <p className="text-[#7A7A7A]">Mon-Sat 9AM-8PM</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-[#b89433] to-[#c87c38] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#3A2F25] mb-3">Email Us</h3>
              <p className="text-[#7A7A7A] text-lg">hello@gifthampers.com</p>
              <p className="text-[#7A7A7A]">We reply within 24 hours</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-[#b89433] to-[#c87c38] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#3A2F25] mb-3">Visit Us</h3>
              <p className="text-[#7A7A7A] text-lg">123 Gift Street</p>
              <p className="text-[#7A7A7A]">Mumbai, India 400001</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hamper Detail Modal */}
      {selectedHamper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-6 border-b border-gray-100 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-3xl font-bold text-[#3A2F25]">{selectedHamper.name}</h2>
              <button 
                onClick={closeHamperDetail}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div>
                  <div className="mb-6">
                    <img 
                      src={selectedHamper.gallery[activeImageIndex]} 
                      alt={selectedHamper.name}
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedHamper.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImageIndex === index ? 'border-[#b89433]' : 'border-gray-200'
                        }`}
                      >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Product Details */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedHamper.rating) ? 'fill-[#b89433] text-[#b89433]' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-[#7A7A7A] ml-2">({selectedHamper.reviews} reviews)</span>
                  </div>
                  
                  <p className="text-[#7A7A7A] text-lg mb-6 leading-relaxed">{selectedHamper.description}</p>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#3A2F25] mb-4">What's Inside</h3>
                    <ul className="space-y-3">
                      {selectedHamper.contents.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-[#7A7A7A]">
                          <div className="w-2 h-2 bg-[#b89433] rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#3A2F25] mb-4">Special Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedHamper.features.map((feature, index) => (
                        <div key={index} className="bg-[#b89433]/10 rounded-lg p-3 text-[#3A2F25] text-sm font-medium">
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#3A2F25] mb-4">Our Story</h3>
                    <p className="text-[#7A7A7A] leading-relaxed">{selectedHamper.story}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[#3A2F25] font-semibold">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-[#b89433] flex items-center justify-center hover:bg-[#b89433] hover:text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full border border-[#b89433] flex items-center justify-center hover:bg-[#b89433] hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="flex-1 bg-gradient-to-r from-[#c87c38] to-[#A07e7e] text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button className="border-2 border-[#b89433] text-[#b89433] px-8 py-4 rounded-full font-bold hover:bg-[#b89433] hover:text-white transition-all duration-300">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Truck className="w-6 h-6 text-[#b89433]" />
                      <span className="text-sm text-[#7A7A7A]">Free Delivery</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <RotateCcw className="w-6 h-6 text-[#b89433]" />
                      <span className="text-sm text-[#7A7A7A]">Easy Returns</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="w-6 h-6 text-[#b89433]" />
                      <span className="text-sm text-[#7A7A7A]">Quality Assured</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Tabs */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-[#3A2F25] mb-4">Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHamper.ingredients.map((ingredient, index) => (
                        <span key={index} className="bg-[#b89433]/10 text-[#3A2F25] px-3 py-1 rounded-full text-sm">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-[#3A2F25] mb-4">Nutritional Info</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedHamper.nutritionalInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-[#7A7A7A]">{key}:</span>
                          <span className="text-[#3A2F25] font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;