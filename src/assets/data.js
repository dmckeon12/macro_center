export const data = {
  healthcheck: {
    message: "OK",
  },
  products: [
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
      main_picture_url: "https://example.com/ryzen-7950x.jpg",
      description: "AMD's flagship desktop processor featuring 16 cores and 32 threads for exceptional multi-tasking and gaming performance."
    },
    {
      id: 2,
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
      main_picture_url: "https://example.com/rtx-4080.jpg",
      description: "High-end graphics card featuring NVIDIA's Ada Lovelace architecture for exceptional gaming and creative workloads."
    },
    {
      id: 3,
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
      main_picture_url: "https://example.com/rog-x670e.jpg",
      description: "High-end AM5 motherboard with PCIe 5.0, DDR5 support, and premium gaming features."
    }
  ]
}
