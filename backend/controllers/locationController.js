import supabaseClient from "../services/supabaseClient.js";

export const getAllLocations = async (req, res) => {
  try {
    const { data: users, error: usersError } = await supabaseClient
      .from('users_info')
      .select('id, location');  
    
    const { data: vendors, error: vendorsError } = await supabaseClient 
        .from('vendorsData')
        .select('vendors_id, location');

    const {data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('total_amount, location' );
    if (usersError || vendorsError || ordersError) {
        throw new Error('Error fetching data from database');
    }
    const userCityMap = {};
    users.forEach((u) => {
      if (u.location) userCityMap[u.id] = u.location.trim();
    });
    
    const locationMap = new Set();

    users?.forEach(u=>{
        if(!u.location) return;
        const loc = u.location.trim()
        if(!locationMap[loc]){
            locationMap[loc] = {city: loc, userCount:0, vendorCount:0, orderCount:0, revenue:0};
        }
        locationMap[loc].userCount ++;
    })

    vendors?.forEach(v=>{
        if(!v.location) return;
        const loc = v.location.trim()
        if(!locationMap[loc]){
            locationMap[loc] = {city: loc, userCount:0, vendorCount:0, orderCount:0, revenue:0};
        }
        locationMap[loc].vendorCount +=1;
    });

    orders?.forEach(o=>{
        if(!o.location) return;
        const loc = o.location.trim()
        if(!locationMap[loc]){
            locationMap[loc] = {city: loc, userCount:0, vendorCount:0, orderCount:0, revenue:0};
        }
        locationMap[loc].orderCount +=1;
        locationMap[loc].revenue += Number(o.total_amount ?? 0);
    });

    const locations = Object.values(locationMap).map(loc=>({
        ...loc,
        marketDensity: 
        loc.vendorCount > 0 ? (loc.userCount / loc.vendorCount).toFixed(1) + "users/vendor" : "N/A",
        averageOrderValue: 
        loc.orderCount > 0 ? `$${(loc.revenue / loc.orderCount).toFixed(0)}` : "$0"
    }));
    res.status(200).json({ locations });
  }
    catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLocationDetails = async (req, res) => {
    let { city } = req.params;
    city = city.replace(/^:/, "").trim();

    try {
        const { data: users, error: usersError } = await supabaseClient
        .from('users_info')
        .select('id, location')
        .ilike('location', city);
        
        const { data: vendors, error: vendorsError } = await supabaseClient
        .from('vendorsData')
        .select('vendors_id, location')
        .ilike('location', city);
        
        const {data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('id, total_amount, location')
        .ilike('location', city);

        if (usersError || vendorsError || ordersError) {
            throw new Error('Error fetching data from database');
        }

        const userCount = users?.length ?? 0;
        const vendorCount = vendors?.length ?? 0;
        const orderCount = orders?.length ?? 0;
        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0) ?? 0;

        const LocationData = {
            city,
            userCount,
            vendorCount,
            orderCount,
            revenue: totalRevenue,

            marketDensity: vendorCount > 0 ? (userCount / vendorCount).toFixed(1) + " users/vendor" : "N/A",
            averageOrderValue: orderCount > 0 ? `$${(totalRevenue / orderCount).toFixed(0)}` : "$0",
            marketPenetration: vendorCount > 0 ? ((userCount / vendorCount) * 100).toFixed(2) + "%" : "N/A",
            revenuePerUser : userCount > 0 ? `$${(totalRevenue / userCount).toFixed(2)}` : "$0"
        };
        res.status(200).json({ location: LocationData });
        }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
