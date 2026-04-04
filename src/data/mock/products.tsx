const productsMock = [
    {
        "name": "Ibuprofeno",
        "description": "Analgésico y antiinflamatorio",
        "category": "ANALGESIC",
        "status": "out-of-stock",
        "dose": "500mg",
        "presentation": "Tableta",
        "stockForUser": 2,
        "repositionDate": null,
        "price": 10000,
        // Data when consulting product in inventory
        "stock": 50,
        "minStock": 10,
        "commitedStock": 25
    },
    {
        "name": "Amoxicilina",
        "description": "Antibiótico de amplio espectro",
        "category": "ANTIBIOTIC",
        "status": "active",
        "dose": "500mg",
        "presentation": "Cápsula",
        "stockForUser": 1,
        "repositionDate": "2026-04-06T00:00:00.000Z",
        "price": 12500,
        // Data when consulting product in inventory
        "stock": 30,
        "minStock": 8,
        "commitedStock": 18
    },
    {
        "name": "Aspirina",
        "description": "Antinflamatorio y anticoagulante",
        "category": "ANALGESIC",
        "status": "out-of-stock",
        "dose": "325mg",
        "presentation": "Tableta",
        "stockForUser": 0,
        "repositionDate": "2026-04-12T00:00:00.000Z",
        "price": 9500,
        "stock": 0,
        "minStock": 15,
        "commitedStock": 10
    },
    {
        "name": "Omeprazol",
        "description": "Protector gástrico",
        "category": "GASTRO",
        "status": "out-of-stock",
        "dose": "20mg",
        "presentation": "Cápsula",
        "stockForUser": 0,
        "repositionDate": "2026-04-14T00:00:00.000Z",
        "price": 14000,
        "stock": 0,
        "minStock": 12,
        "commitedStock": 8
    },
    {
        "name": "Cetirizina",
        "description": "Antihistamínico para alergias",
        "category": "ANTIHISTAMINE",
        "status": "out-of-stock",
        "dose": "10mg",
        "presentation": "Tableta",
        "stockForUser": 0,
        "repositionDate": "2026-04-10T00:00:00.000Z",
        "price": 7000,
        "stock": 0,
        "minStock": 10,
        "commitedStock": 5
    },
]

export default productsMock;