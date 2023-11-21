//dataMapper

const dataMapper = (data: any, table: string) => {

    switch (table) {
        case "Tiers":
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            createdAt: data.createdAt,
            userId: data.userId,
        };


        case "Articles":
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            createdAt: data.createdAt,
            userId: data.userId,
        };


        case "Contacts":
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            createdAt: data.createdAt,
            userId: data.userId,
        };


        case "Affaires":
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            createdAt: data.createdAt,
            userId: data.userId,
        };


        default:
        return undefined;
    }
    }
