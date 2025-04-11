// Import local images
import logo from './images/logo.png';
import heroBanner from './images/hero-banner.jpg';

// CPU Images
import ryzen7950x from './images/cpu-ryzen-7950x.jpg';
import cpuRyzen7700X from './images/cpu-ryzen-7700x.jpg';
import cpuRyzen5600X from './images/cpu-ryzen-5600x.jpg';
import cpuRyzen5800X3D from './images/cpu-ryzen-5800x3d.jpg';
import cpuIntel13900K from './images/cpu-intel-13900k.jpg';
import cpuIntel12700K from './images/cpu-intel-12700k.jpg';
import cpuIntel12600K from './images/cpu-intel-12600k.jpg';
import cpuIntel12400F from './images/cpu-intel-12400f.jpg';
import cpuRyzen7900X from './images/cpu-ryzen-7900x.jpg';
import cpuIntel13600K from './images/cpu-intel-13600k.jpg';

// GPU Images
import rtx4080 from './images/gpu-rtx-4080.jpg';
import gpuRTX4090 from './images/gpu-rtx-4090.jpg';
import gpuRTX4070Ti from './images/gpu-rtx-4070ti.jpg';
import gpuRTX4070 from './images/gpu-rtx-4070.jpg';
import gpuRTX4060Ti from './images/gpu-rtx-4060ti.jpg';
import gpuRX7900XTX from './images/gpu-rx-7900xtx.jpg';
import gpuRX7900XT from './images/gpu-rx-7900xt.jpg';
import gpuRX7800XT from './images/gpu-rx-7800xt.jpg';
import gpuRX7700XT from './images/gpu-rx-7700xt.jpg';
import gpuRTX3090Ti from './images/gpu-rtx-3090ti.jpg';

// Motherboard Images
import rogX670e from './images/mb-rog-x670e.jpg';
import mbMSIZ790 from './images/mb-msi-z790.jpg';
import mbGigabyteB650 from './images/mb-gigabyte-b650.jpg';
import mbASRockB760 from './images/mb-asrock-b760.jpg';
import mbMSIB650M from './images/mb-msi-b650m.jpg';
import mbROGZ690 from './images/mb-rog-z690.jpg';
import mbAORUSB550 from './images/mb-aorus-b550.jpg';
import mbASRockZ790M from './images/mb-asrock-z790m.jpg';
import mbMSIPROZ690 from './images/mb-msi-pro-z690.jpg';
import mbGigabyteX670 from './images/mb-gigabyte-x670.jpg';

// RAM Images
import ramCorsairVengeance from './images/ram-corsair-vengeance.jpg';
import ramGSkillTrident from './images/ram-gskill-trident.jpg';
import ramKingstonFury from './images/ram-kingston-fury.jpg';
import ramCrucialBallistix from './images/ram-crucial-ballistix.jpg';
import ramTeamGroupElite from './images/ram-teamgroup-elite.jpg';
import ramCorsairDominator from './images/ram-corsair-dominator.jpg';
import ramGSkillRipjaws from './images/ram-gskill-ripjaws.jpg';
import ramTeamTForce from './images/ram-team-tforce.jpg';
import ramAdataXPG from './images/ram-adata-xpg.jpg';
import ramPatriotViper from './images/ram-patriot-viper.jpg';

// Storage Images
import storSamsung980Pro from './images/storage-samsung-980pro.jpg';
import storWDBlack from './images/storage-wd-black.jpg';
import storCrucialP5 from './images/storage-crucial-p5.jpg';
import storSabrentRocket from './images/storage-sabrent-rocket.jpg';
import storSeagateBarracuda from './images/storage-seagate-barracuda.jpg';
import storSamsung870EVO from './images/storage-samsung-870evo.jpg';
import storWDBlueHDD from './images/storage-wd-blue-hdd.jpg';
import storKingstonNV2 from './images/storage-kingston-nv2.jpg';
import storIntelOptane from './images/storage-intel-optane.jpg';
import storSeagateFireCuda from './images/storage-seagate-firecuda.jpg';

// Power Supply Images
import psuCorsairRM850x from './images/psu-corsair-rm850x.jpg';
import psuEVGASupernova from './images/psu-evga-supernova.jpg';
import psuSeasonicFocus from './images/psu-seasonic-focus.jpg';
import psuThermaltakeToughpower from './images/psu-thermaltake-toughpower.jpg';
import psuBeQuietStraight from './images/psu-bequiet-straight.jpg';
import psuMSIMPG from './images/psu-msi-mpg.jpg';
import psuCorsairCX650 from './images/psu-corsair-cx650.jpg';
import psuEVGABQ from './images/psu-evga-bq.jpg';
import psuPhanteksAMP from './images/psu-phanteks-amp.jpg';
import psuSeasonicPrime from './images/psu-seasonic-prime.jpg';



// Export images and make them accessible from data object
const data = {
  logo,
  heroBanner,
  healthcheck: {
    message: "OK",
  },
  products: [
    // CPU Components
    {
      id: 1,
      category: "CPU",
      brand_name: "AMD",
      name: "Ryzen 9 7950X",
      details: "16-Core 32-Thread Desktop Processor",
      price_cents: 69900,
      status: "active",
      specs: {
        cores: 16,
        threads: 32,
        base_clock: "4.5 GHz",
        boost_clock: "5.7 GHz",
        tdp: "170W",
        socket: "AM5"
      },
      stock: true,
      main_picture_url: ryzen7950x,
      description: "AMD's flagship desktop processor featuring 16 cores and 32 threads for exceptional multi-tasking and gaming performance."
    },
    {
      id: 2,
      category: "CPU",
      brand_name: "AMD",
      name: "Ryzen 7 7700X",
      details: "8-Core 16-Thread Desktop Processor",
      price_cents: 39900,
      status: "active",
      specs: {
        cores: 8,
        threads: 16,
        base_clock: "4.5 GHz",
        boost_clock: "5.4 GHz",
        tdp: "105W",
        socket: "AM5"
      },
      stock: true,
      main_picture_url: cpuRyzen7700X,
      description: "High-performance processor with excellent gaming capabilities and content creation performance."
    },
    {
      id: 3,
      category: "CPU",
      brand_name: "AMD",
      name: "Ryzen 5 5600X",
      details: "6-Core 12-Thread Desktop Processor",
      price_cents: 19900,
      status: "active",
      specs: {
        cores: 6,
        threads: 12,
        base_clock: "3.7 GHz",
        boost_clock: "4.6 GHz",
        tdp: "65W",
        socket: "AM4"
      },
      stock: true,
      main_picture_url: cpuRyzen5600X,
      description: "Excellent mid-range gaming CPU with incredible value and performance."
    },
    {
      id: 4,
      category: "CPU",
      brand_name: "AMD",
      name: "Ryzen 7 5800X3D",
      details: "8-Core 16-Thread Desktop Processor with 3D V-Cache",
      price_cents: 32900,
      status: "active",
      specs: {
        cores: 8,
        threads: 16,
        base_clock: "3.4 GHz",
        boost_clock: "4.5 GHz",
        tdp: "105W",
        socket: "AM4"
      },
      stock: true,
      main_picture_url: cpuRyzen5800X3D,
      description: "Gaming-focused CPU with revolutionary 3D V-Cache technology for maximum gaming performance."
    },
    {
      id: 5,
      category: "CPU",
      brand_name: "Intel",
      name: "Core i9-13900K",
      details: "24-Core (8P+16E) 32-Thread Desktop Processor",
      price_cents: 59900,
      status: "active",
      specs: {
        cores: 24,
        threads: 32,
        base_clock: "3.0 GHz",
        boost_clock: "5.8 GHz",
        tdp: "125W",
        socket: "LGA1700"
      },
      stock: true,
      main_picture_url: cpuIntel13900K,
      description: "Intel's flagship processor with hybrid architecture for extreme gaming and content creation."
    },
    {
      id: 6,
      category: "CPU",
      brand_name: "Intel",
      name: "Core i7-12700K",
      details: "12-Core (8P+4E) 20-Thread Desktop Processor",
      price_cents: 34900,
      status: "active",
      specs: {
        cores: 12,
        threads: 20,
        base_clock: "3.6 GHz",
        boost_clock: "5.0 GHz",
        tdp: "125W",
        socket: "LGA1700"
      },
      stock: true,
      main_picture_url: cpuIntel12700K,
      description: "Powerful mid-range CPU with hybrid architecture perfect for gaming and productivity."
    },
    {
      id: 7,
      category: "CPU",
      brand_name: "Intel",
      name: "Core i5-12600K",
      details: "10-Core (6P+4E) 16-Thread Desktop Processor",
      price_cents: 27900,
      status: "active",
      specs: {
        cores: 10,
        threads: 16,
        base_clock: "3.7 GHz",
        boost_clock: "4.9 GHz",
        tdp: "125W",
        socket: "LGA1700"
      },
      stock: true,
      main_picture_url: cpuIntel12600K,
      description: "Excellent value gaming CPU with hybrid architecture and great overclocking potential."
    },
    {
      id: 8,
      category: "CPU",
      brand_name: "Intel",
      name: "Core i5-12400F",
      details: "6-Core 12-Thread Desktop Processor",
      price_cents: 16900,
      status: "active",
      specs: {
        cores: 6,
        threads: 12,
        base_clock: "2.5 GHz",
        boost_clock: "4.4 GHz",
        tdp: "65W",
        socket: "LGA1700"
      },
      stock: true,
      main_picture_url: cpuIntel12400F,
      description: "Budget-friendly CPU that delivers exceptional gaming performance at a reasonable price."
    },
    {
      id: 9,
      category: "CPU",
      brand_name: "AMD",
      name: "Ryzen 9 7900X",
      details: "12-Core 24-Thread Desktop Processor",
      price_cents: 44900,
      status: "active",
      specs: {
        cores: 12,
        threads: 24,
        base_clock: "4.7 GHz",
        boost_clock: "5.6 GHz",
        tdp: "170W",
        socket: "AM5"
      },
      stock: true,
      main_picture_url: cpuRyzen7900X,
      description: "High-end Zen 4 processor with excellent multi-core performance for demanding workloads."
    },
    {
      id: 10,
      category: "CPU",
      brand_name: "Intel",
      name: "Core i5-13600K",
      details: "14-Core (6P+8E) 20-Thread Desktop Processor",
      price_cents: 31900,
      status: "active",
      specs: {
        cores: 14,
        threads: 20,
        base_clock: "3.5 GHz",
        boost_clock: "5.1 GHz",
        tdp: "125W",
        socket: "LGA1700"
      },
      stock: true,
      main_picture_url: cpuIntel13600K,
      description: "Outstanding mid-range CPU with excellent gaming and multitasking capabilities."
    },
    
    // GPU Components
    {
      id: 11,
      category: "GPU",
      brand_name: "NVIDIA",
      name: "GeForce RTX 4080",
      details: "16GB GDDR6X Graphics Card",
      price_cents: 119900,
      status: "active",
      specs: {
        memory: "16GB GDDR6X",
        boost_clock: "2.51 GHz",
        cuda_cores: 9728,
        tdp: "320W"
      },
      stock: true,
      main_picture_url: rtx4080,
      description: "High-end graphics card featuring NVIDIA's Ada Lovelace architecture for exceptional gaming and creative workloads."
    },
    {
      id: 12,
      category: "GPU",
      brand_name: "NVIDIA",
      name: "GeForce RTX 4090",
      details: "24GB GDDR6X Graphics Card",
      price_cents: 159900,
      status: "active",
      specs: {
        memory: "24GB GDDR6X",
        boost_clock: "2.52 GHz",
        cuda_cores: 16384,
        tdp: "450W"
      },
      stock: true,
      main_picture_url: gpuRTX4090,
      description: "NVIDIA's flagship GPU with unmatched performance for gaming and content creation."
    },
    {
      id: 13,
      category: "GPU",
      brand_name: "NVIDIA",
      name: "GeForce RTX 4070 Ti",
      details: "12GB GDDR6X Graphics Card",
      price_cents: 79900,
      status: "active",
      specs: {
        memory: "12GB GDDR6X",
        boost_clock: "2.61 GHz",
        cuda_cores: 7680,
        tdp: "285W"
      },
      stock: true,
      main_picture_url: gpuRTX4070Ti,
      description: "Excellent high-end GPU with great performance-to-price ratio for gamers and creators."
    },
    {
      id: 14,
      category: "GPU",
      brand_name: "NVIDIA",
      name: "GeForce RTX 4070",
      details: "12GB GDDR6X Graphics Card",
      price_cents: 59900,
      status: "active",
      specs: {
        memory: "12GB GDDR6X",
        boost_clock: "2.48 GHz",
        cuda_cores: 5888,
        tdp: "200W"
      },
      stock: true,
      main_picture_url: gpuRTX4070,
      description: "Mid-range GPU offering excellent performance with DLSS 3.0 and ray tracing capabilities."
    },
    {
      id: 15,
      category: "GPU",
      brand_name: "NVIDIA",
      name: "GeForce RTX 4060 Ti",
      details: "8GB GDDR6 Graphics Card",
      price_cents: 39900,
      status: "active",
      specs: {
        memory: "8GB GDDR6",
        boost_clock: "2.54 GHz",
        cuda_cores: 4352,
        tdp: "160W"
      },
      stock: true,
      main_picture_url: gpuRTX4060Ti,
      description: "Perfect 1080p and 1440p gaming GPU with great efficiency and ray tracing support."
    },
    {
      id: 16,
      category: "GPU",
      brand_name: "AMD",
      name: "Radeon RX 7900 XTX",
      details: "24GB GDDR6 Graphics Card",
      price_cents: 99900,
      status: "active",
      specs: {
        memory: "24GB GDDR6",
        boost_clock: "2.5 GHz",
        stream_processors: 12288,
        tdp: "355W"
      },
      stock: true,
      main_picture_url: gpuRX7900XTX,
      description: "AMD's flagship GPU offering excellent performance for 4K gaming and content creation."
    },
    {
      id: 17,
      category: "GPU",
      brand_name: "AMD",
      name: "Radeon RX 7900 XT",
      details: "20GB GDDR6 Graphics Card",
      price_cents: 84900,
      status: "active",
      specs: {
        memory: "20GB GDDR6",
        boost_clock: "2.4 GHz",
        stream_processors: 10752,
        tdp: "300W"
      },
      stock: true,
      main_picture_url: gpuRX7900XT,
      description: "High-end AMD GPU with excellent 4K gaming performance and competitive pricing."
    },
    {
      id: 18,
      category: "GPU",
      brand_name: "AMD",
      name: "Radeon RX 7800 XT",
      details: "16GB GDDR6 Graphics Card",
      price_cents: 59900,
      status: "active",
      specs: {
        memory: "16GB GDDR6",
        boost_clock: "2.43 GHz",
        stream_processors: 3840,
        tdp: "263W"
      },
      stock: true,
      main_picture_url: gpuRX7800XT,
      description: "Excellent 1440p gaming GPU with generous VRAM and competitive performance."
    },
    {
      id: 19,
      category: "GPU",
      brand_name: "AMD",
      name: "Radeon RX 7700 XT",
      details: "12GB GDDR6 Graphics Card",
      price_cents: 44900,
      status: "active",
      specs: {
        memory: "12GB GDDR6",
        boost_clock: "2.54 GHz",
        stream_processors: 3456,
        tdp: "245W"
      },
      stock: true,
      main_picture_url: gpuRX7700XT,
      description: "Mid-range GPU with solid 1440p gaming performance and excellent efficiency."
    },
    {
      id: 20,
      category: "GPU",
      brand_name: "NVIDIA",
      name: "GeForce RTX 3090 Ti",
      details: "24GB GDDR6X Graphics Card",
      price_cents: 99900,
      status: "active",
      specs: {
        memory: "24GB GDDR6X",
        boost_clock: "1.86 GHz",
        cuda_cores: 10752,
        tdp: "450W"
      },
      stock: true,
      main_picture_url: gpuRTX3090Ti,
      description: "Previous generation flagship with excellent performance for both gaming and creative workloads."
    },
    
    // Motherboard Components
    {
      id: 21,
      category: "Motherboard",
      brand_name: "ASUS",
      name: "ROG Strix X670E-E Gaming WiFi",
      details: "AM5 ATX Gaming Motherboard",
      price_cents: 49900,
      status: "active",
      specs: {
        socket: "AM5",
        form_factor: "ATX",
        memory_support: "DDR5",
        pcie_version: "PCIe 5.0"
      },
      stock: true,
      main_picture_url: rogX670e,
      description: "High-end AM5 motherboard with PCIe 5.0, DDR5 support, and premium gaming features."
    },
    {
      id: 22,
      category: "Motherboard",
      brand_name: "MSI",
      name: "MPG Z790 EDGE WIFI",
      details: "LGA1700 ATX Gaming Motherboard",
      price_cents: 39900,
      status: "active",
      specs: {
        socket: "LGA1700",
        form_factor: "ATX",
        memory_support: "DDR5",
        pcie_version: "PCIe 5.0"
      },
      stock: true,
      main_picture_url: mbMSIZ790,
      description: "Feature-packed motherboard for Intel 12th and 13th gen processors with robust VRM and cooling."
    },
    {
      id: 23,
      category: "Motherboard",
      brand_name: "Gigabyte",
      name: "B650 AORUS ELITE AX",
      details: "AM5 ATX Motherboard",
      price_cents: 22900,
      status: "active",
      specs: {
        socket: "AM5",
        form_factor: "ATX",
        memory_support: "DDR5",
        pcie_version: "PCIe 4.0"
      },
      stock: true,
      main_picture_url: mbGigabyteB650,
      description: "Mid-range AM5 motherboard with excellent features and value for Ryzen 7000 series CPUs."
    },
    {
      id: 24,
      category: "Motherboard",
      brand_name: "ASRock",
      name: "B760 Pro RS WiFi",
      details: "LGA1700 ATX Motherboard",
      price_cents: 16900,
      status: "active",
      specs: {
        socket: "LGA1700",
        form_factor: "ATX",
        memory_support: "DDR4",
        pcie_version: "PCIe 4.0"
      },
      stock: true,
      main_picture_url: mbASRockB760,
      description: "Budget-friendly Intel B760 motherboard with WiFi 6E and solid feature set."
    },
    {
      id: 25,
      category: "Motherboard",
      brand_name: "MSI",
      name: "MAG B650M MORTAR WIFI",
      details: "AM5 Micro-ATX Motherboard",
      price_cents: 19900,
      status: "active",
      specs: {
        socket: "AM5",
        form_factor: "Micro-ATX",
        memory_support: "DDR5",
        pcie_version: "PCIe 4.0"
      },
      stock: true,
      main_picture_url: mbMSIB650M,
      description: "Compact but feature-rich motherboard for AMD Ryzen 7000 series processors."
    },
    {
      id: 26,
      category: "Motherboard",
      brand_name: "ASUS",
      name: "ROG STRIX Z690-A GAMING WIFI",
      details: "LGA1700 ATX Gaming Motherboard",
      price_cents: 32900,
      status: "active",
      specs: {
        socket: "LGA1700",
        form_factor: "ATX",
        memory_support: "DDR5",
        pcie_version: "PCIe 5.0"
      },
      stock: true,
      main_picture_url: mbROGZ690,
      description: "Premium white-themed Z690 motherboard with robust VRM and excellent connectivity."
    },
    {
      id: 27,
      category: "Motherboard",
      brand_name: "Gigabyte",
      name: "B550 AORUS PRO",
      details: "AM4 ATX Motherboard",
      price_cents: 17900,
      status: "active",
      specs: {
        socket: "AM4",
        form_factor: "ATX",
        memory_support: "DDR4",
        pcie_version: "PCIe 4.0"
      },
      stock: true,
      main_picture_url: mbAORUSB550,
      description: "Excellent value motherboard for AMD Ryzen 5000 series processors with premium features."
    },
    {
      id: 28,
      category: "Motherboard",
      brand_name: "ASRock",
      name: "Z790M PG LIGHTNING",
      details: "LGA1700 Micro-ATX Motherboard",
      price_cents: 21900,
      status: "active",
      specs: {
        socket: "LGA1700",
        form_factor: "Micro-ATX",
        memory_support: "DDR5",
        pcie_version: "PCIe 5.0"
      },
      stock: true,
      main_picture_url: mbASRockZ790M,
      description: "Compact high-performance motherboard for Intel 13th gen processors."
    },
    {
      id: 29,
      category: "Motherboard",
      brand_name: "MSI",
      name: "PRO Z690-A DDR4",
      details: "LGA1700 ATX Motherboard",
      price_cents: 19900,
      status: "active",
      specs: {
        socket: "LGA1700",
        form_factor: "ATX",
        memory_support: "DDR4",
        pcie_version: "PCIe 5.0"
      },
      stock: true,
      main_picture_url: mbMSIPROZ690,
      description: "Value-oriented Z690 motherboard with DDR4 support for easier upgrades."
    },
    {
      id: 30,
      category: "Motherboard",
      brand_name: "Gigabyte",
      name: "X670 AORUS MASTER",
      details: "AM5 E-ATX Motherboard",
      price_cents: 47900,
      status: "active",
      specs: {
        socket: "AM5",
        form_factor: "E-ATX",
        memory_support: "DDR5",
        pcie_version: "PCIe 5.0"
      },
      stock: true,
      main_picture_url: mbGigabyteX670,
      description: "Premium AMD X670 motherboard with high-end VRM, cooling, and connectivity features."  
    },
    
    // RAM Components
    {
      id: 31,
      category: "RAM",
      brand_name: "Corsair",
      name: "Vengeance RGB Pro",
      details: "32GB (2x16GB) DDR4-3600",
      price_cents: 11900,
      status: "active",
      specs: {
        capacity: "32GB",
        modules: "2x16GB",
        type: "DDR4",
        speed: "3600MHz",
        cas_latency: "18"
      },
      stock: true,
      main_picture_url: ramCorsairVengeance,
      description: "RGB-enabled performance memory with aluminum heat spreaders for excellent cooling."
    },
    {
      id: 32,
      category: "RAM",
      brand_name: "G.Skill",
      name: "Trident Z RGB",
      details: "32GB (2x16GB) DDR4-3200",
      price_cents: 12900,
      status: "active",
      specs: {
        capacity: "32GB",
        modules: "2x16GB",
        type: "DDR4",
        speed: "3200MHz",
        cas_latency: "16"
      },
      stock: true,
      main_picture_url: ramGSkillTrident,
      description: "Premium RGB gaming memory with striking design and reliable performance."
    },
    {
      id: 33,
      category: "RAM",
      brand_name: "Kingston",
      name: "FURY Beast DDR5",
      details: "32GB (2x16GB) DDR5-6000",
      price_cents: 15900,
      status: "active",
      specs: {
        capacity: "32GB",
        modules: "2x16GB",
        type: "DDR5",
        speed: "6000MHz",
        cas_latency: "40"
      },
      stock: true,
      main_picture_url: ramKingstonFury,
      description: "High-performance DDR5 memory with on-die ECC for better stability."
    },
    {
      id: 34,
      category: "RAM",
      brand_name: "Crucial",
      name: "Ballistix RGB",
      details: "16GB (2x8GB) DDR4-3600",
      price_cents: 8900,
      status: "active",
      specs: {
        capacity: "16GB",
        modules: "2x8GB",
        type: "DDR4",
        speed: "3600MHz",
        cas_latency: "16"
      },
      stock: true,
      main_picture_url: ramCrucialBallistix,
      description: "Engineered for the latest AMD and Intel platforms with XMP 2.0 support."
    },
    {
      id: 35,
      category: "RAM",
      brand_name: "Team Group",
      name: "Elite Plus",
      details: "16GB (2x8GB) DDR4-3200",
      price_cents: 5900,
      status: "active",
      specs: {
        capacity: "16GB",
        modules: "2x8GB",
        type: "DDR4",
        speed: "3200MHz",
        cas_latency: "22"
      },
      stock: true,
      main_picture_url: ramTeamGroupElite,
      description: "Budget-friendly memory with solid performance for everyday computing."
    },
    {
      id: 36,
      category: "RAM",
      brand_name: "Corsair",
      name: "Dominator Platinum RGB",
      details: "32GB (2x16GB) DDR5-5600",
      price_cents: 19900,
      status: "active",
      specs: {
        capacity: "32GB",
        modules: "2x16GB",
        type: "DDR5",
        speed: "5600MHz",
        cas_latency: "36"
      },
      stock: true,
      main_picture_url: ramCorsairDominator,
      description: "Premium DDR5 memory with patented DHX cooling technology and Capellix RGB LEDs."
    },
    {
      id: 37,
      category: "RAM",
      brand_name: "G.Skill",
      name: "Ripjaws V",
      details: "32GB (2x16GB) DDR4-3600",
      price_cents: 10900,
      status: "active",
      specs: {
        capacity: "32GB",
        modules: "2x16GB",
        type: "DDR4",
        speed: "3600MHz",
        cas_latency: "18"
      },
      stock: true,
      main_picture_url: ramGSkillRipjaws,
      description: "High-performance memory designed for optimal compatibility with Intel and AMD platforms."
    },
    {
      id: 38,
      category: "RAM",
      brand_name: "Team Group",
      name: "T-Force Delta RGB",
      details: "32GB (2x16GB) DDR4-3200",
      price_cents: 10900,
      status: "active",
      specs: {
        capacity: "32GB",
        modules: "2x16GB",
        type: "DDR4",
        speed: "3200MHz",
        cas_latency: "16"
      },
      stock: true,
      main_picture_url: ramTeamTForce,
      description: "Full-frame RGB illumination with excellent overclocking potential."
    },
    {
      id: 39,
      category: "RAM",
      brand_name: "ADATA",
      name: "XPG SPECTRIX D45G",
      details: "16GB (2x8GB) DDR4-3600",
      price_cents: 7900,
      status: "active",
      specs: {
        capacity: "16GB",
        modules: "2x8GB",
        type: "DDR4",
        speed: "3600MHz",
        cas_latency: "18"
      },
      stock: true,
      main_picture_url: ramAdataXPG,
      description: "Reliable gaming memory with stylish RGB lighting and effective heat dissipation."
    },
    {
      id: 40,
      category: "RAM",
      brand_name: "Patriot",
      name: "Viper Steel",
      details: "32GB (2x16GB) DDR4-3200",
      price_cents: 9900,
      status: "active",
      specs: {
        capacity: "32GB",
        modules: "2x16GB",
        type: "DDR4",
        speed: "3200MHz",
        cas_latency: "16"
      },
      stock: true,
      main_picture_url: ramPatriotViper,
      description: "Performance-oriented memory with robust aluminum heat shield for extreme overclocking."  
    },
    
    // Storage Components
    {
      id: 41,
      category: "Storage",
      brand_name: "Samsung",
      name: "980 PRO",
      details: "1TB NVMe PCIe 4.0 SSD",
      price_cents: 14900,
      status: "active",
      specs: {
        capacity: "1TB",
        interface: "PCIe 4.0 x4",
        form_factor: "M.2 2280",
        read_speed: "7000 MB/s",
        write_speed: "5000 MB/s"
      },
      stock: true,
      main_picture_url: storSamsung980Pro,
      description: "High-performance PCIe 4.0 NVMe SSD for professional computing and gaming."
    },
    {
      id: 42,
      category: "Storage",
      brand_name: "Western Digital",
      name: "WD_BLACK SN850X",
      details: "2TB NVMe PCIe 4.0 SSD",
      price_cents: 19900,
      status: "active",
      specs: {
        capacity: "2TB",
        interface: "PCIe 4.0 x4",
        form_factor: "M.2 2280",
        read_speed: "7300 MB/s",
        write_speed: "6600 MB/s"
      },
      stock: true,
      main_picture_url: storWDBlack,
      description: "Gaming-focused SSD designed for maximum performance and low latency."
    },
    {
      id: 43,
      category: "Storage",
      brand_name: "Crucial",
      name: "P5 Plus",
      details: "1TB NVMe PCIe 4.0 SSD",
      price_cents: 12900,
      status: "active",
      specs: {
        capacity: "1TB",
        interface: "PCIe 4.0 x4",
        form_factor: "M.2 2280",
        read_speed: "6600 MB/s",
        write_speed: "5000 MB/s"
      },
      stock: true,
      main_picture_url: storCrucialP5,
      description: "Highly reliable PCIe 4.0 SSD for content creators and professionals."
    },
    {
      id: 44,
      category: "Storage",
      brand_name: "Sabrent",
      name: "Rocket 4 Plus",
      details: "2TB NVMe PCIe 4.0 SSD",
      price_cents: 24900,
      status: "active",
      specs: {
        capacity: "2TB",
        interface: "PCIe 4.0 x4",
        form_factor: "M.2 2280",
        read_speed: "7100 MB/s",
        write_speed: "6600 MB/s"
      },
      stock: true,
      main_picture_url: storSabrentRocket,
      description: "High-performance SSD with Phison E18 controller and TLC NAND flash."
    },
    {
      id: 45,
      category: "Storage",
      brand_name: "Seagate",
      name: "BarraCuda",
      details: "2TB 7200RPM HDD",
      price_cents: 5499,
      status: "active",
      specs: {
        capacity: "2TB",
        interface: "SATA 6Gb/s",
        form_factor: "3.5-inch",
        speed: "7200 RPM",
        cache: "256MB"
      },
      stock: true,
      main_picture_url: storSeagateBarracuda,
      description: "Reliable mechanical hard drive for mass storage needs."
    },
    {
      id: 46,
      category: "Storage",
      brand_name: "Samsung",
      name: "870 EVO",
      details: "1TB SATA SSD",
      price_cents: 9900,
      status: "active",
      specs: {
        capacity: "1TB",
        interface: "SATA 6Gb/s",
        form_factor: "2.5-inch",
        read_speed: "560 MB/s",
        write_speed: "530 MB/s"
      },
      stock: true,
      main_picture_url: storSamsung870EVO,
      description: "Reliable and fast SATA SSD for upgrading older systems."
    },
    {
      id: 47,
      category: "Storage",
      brand_name: "Western Digital",
      name: "WD Blue",
      details: "4TB 5400RPM HDD",
      price_cents: 7499,
      status: "active",
      specs: {
        capacity: "4TB",
        interface: "SATA 6Gb/s",
        form_factor: "3.5-inch",
        speed: "5400 RPM",
        cache: "64MB"
      },
      stock: true,
      main_picture_url: storWDBlueHDD,
      description: "High-capacity hard drive for archival storage and media libraries."
    },
    {
      id: 48,
      category: "Storage",
      brand_name: "Kingston",
      name: "NV2",
      details: "1TB NVMe PCIe 4.0 SSD",
      price_cents: 8900,
      status: "active",
      specs: {
        capacity: "1TB",
        interface: "PCIe 4.0 x4",
        form_factor: "M.2 2280",
        read_speed: "3500 MB/s",
        write_speed: "2100 MB/s"
      },
      stock: true,
      main_picture_url: storKingstonNV2,
      description: "Budget-friendly PCIe 4.0 SSD with good performance for everyday computing."
    },
    {
      id: 49,
      category: "Storage",
      brand_name: "Intel",
      name: "Optane 905P",
      details: "480GB PCIe 3.0 SSD",
      price_cents: 49900,
      status: "active",
      specs: {
        capacity: "480GB",
        interface: "PCIe 3.0 x4",
        form_factor: "U.2",
        read_speed: "2600 MB/s",
        write_speed: "2200 MB/s"
      },
      stock: true,
      main_picture_url: storIntelOptane,
      description: "Ultra-low latency storage solution for specialized workloads requiring exceptional endurance."
    },
    {
      id: 50,
      category: "Storage",
      brand_name: "Seagate",
      name: "FireCuda 530",
      details: "2TB NVMe PCIe 4.0 SSD with Heatsink",
      price_cents: 29900,
      status: "active",
      specs: {
        capacity: "2TB",
        interface: "PCIe 4.0 x4",
        form_factor: "M.2 2280",
        read_speed: "7300 MB/s",
        write_speed: "6900 MB/s"
      },
      stock: true,
      main_picture_url: storSeagateFireCuda,
      description: "High-end gaming SSD with integrated heatsink for PlayStation 5 compatibility and desktop use."  
    },
    
    // Power Supply Components
    {
      id: 51,
      category: "Power Supply",
      brand_name: "Corsair",
      name: "RM850x",
      details: "850W 80+ Gold Fully Modular",
      price_cents: 13900,
      status: "active",
      specs: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        form_factor: "ATX",
        fan_size: "135mm"
      },
      stock: true,
      main_picture_url: psuCorsairRM850x,
      description: "High-quality power supply with Zero RPM fan mode and Japanese capacitors."
    },
    {
      id: 52,
      category: "Power Supply",
      brand_name: "EVGA",
      name: "SuperNOVA 1000 G6",
      details: "1000W 80+ Gold Fully Modular",
      price_cents: 19900,
      status: "active",
      specs: {
        wattage: "1000W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        form_factor: "ATX",
        fan_size: "140mm"
      },
      stock: true,
      main_picture_url: psuEVGASupernova,
      description: "Powerful and efficient PSU for high-end gaming rigs with excellent voltage stability."
    },
    {
      id: 53,
      category: "Power Supply",
      brand_name: "Seasonic",
      name: "FOCUS GX-750",
      details: "750W 80+ Gold Fully Modular",
      price_cents: 12900,
      status: "active",
      specs: {
        wattage: "750W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        form_factor: "ATX",
        fan_size: "120mm"
      },
      stock: true,
      main_picture_url: psuSeasonicFocus,
      description: "Reliable and efficient power supply with hybrid fan control for silent operation."
    },
    {
      id: 54,
      category: "Power Supply",
      brand_name: "Thermaltake",
      name: "Toughpower GF1 850W",
      details: "850W 80+ Gold Fully Modular",
      price_cents: 14900,
      status: "active",
      specs: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        form_factor: "ATX",
        fan_size: "140mm"
      },
      stock: true,
      main_picture_url: psuThermaltakeToughpower,
      description: "Gaming-focused PSU with ultra-quiet 140mm fan and high-quality components."
    },
    {
      id: 55,
      category: "Power Supply",
      brand_name: "be quiet!",
      name: "Straight Power 11 750W",
      details: "750W 80+ Platinum Fully Modular",
      price_cents: 15900,
      status: "active",
      specs: {
        wattage: "750W",
        efficiency: "80+ Platinum",
        modularity: "Fully Modular",
        form_factor: "ATX",
        fan_size: "135mm"
      },
      stock: true,
      main_picture_url: psuBeQuietStraight,
      description: "Silent-focused power supply with exceptional efficiency and build quality."
    },
    {
      id: 56,
      category: "Power Supply",
      brand_name: "MSI",
      name: "MPG A850GF",
      details: "850W 80+ Gold Fully Modular",
      price_cents: 13900,
      status: "active",
      specs: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        form_factor: "ATX",
        fan_size: "140mm"
      },
      stock: true,
      main_picture_url: psuMSIMPG,
      description: "Compact design PSU with high-performance for enthusiast gaming builds."
    },
    {
      id: 57,
      category: "Power Supply",
      brand_name: "Corsair",
      name: "CX650",
      details: "650W 80+ Bronze Semi-Modular",
      price_cents: 7900,
      status: "active",
      specs: {
        wattage: "650W",
        efficiency: "80+ Bronze",
        modularity: "Semi-Modular",
        form_factor: "ATX",
        fan_size: "120mm"
      },
      stock: true,
      main_picture_url: psuCorsairCX650,
      description: "Budget-friendly PSU with reliable performance for mid-range gaming systems."
    },
    {
      id: 58,
      category: "Power Supply",
      brand_name: "EVGA",
      name: "600 BQ",
      details: "600W 80+ Bronze Semi-Modular",
      price_cents: 5900,
      status: "active",
      specs: {
        wattage: "600W",
        efficiency: "80+ Bronze",
        modularity: "Semi-Modular",
        form_factor: "ATX",
        fan_size: "120mm"
      },
      stock: true,
      main_picture_url: psuEVGABQ,
      description: "Affordable power supply with reliable performance and good efficiency."
    },
    {
      id: 59,
      category: "Power Supply",
      brand_name: "Phanteks",
      name: "AMP 750W",
      details: "750W 80+ Gold Fully Modular",
      price_cents: 11900,
      status: "active",
      specs: {
        wattage: "750W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        form_factor: "ATX",
        fan_size: "120mm"
      },
      stock: true,
      main_picture_url: psuPhanteksAMP,
      description: "High-quality PSU with clean power delivery and excellent build quality."
    },
    {
      id: 60,
      category: "Power Supply",
      brand_name: "Seasonic",
      name: "PRIME TX-1000",
      details: "1000W 80+ Titanium Fully Modular",
      price_cents: 29900,
      status: "active",
      specs: {
        wattage: "1000W",
        efficiency: "80+ Titanium",
        modularity: "Fully Modular",
        form_factor: "ATX",
        fan_size: "135mm"
      },
      stock: true,
      main_picture_url: psuSeasonicPrime,
      description: "Ultra-high-end power supply with the highest efficiency rating and premium components."  
    },
    

  ]
};

export default data;
