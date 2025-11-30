import supabase from '../services/supabaseClient.js';

//For Dashboard Overview
export const getTotalUsers = async (req, res) => {
    const {count, error} = await supabase
        .from('Users')
        .select('*', { count: 'exact', head: true });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ totalUsers: count });
};

export const getNewUsersToday = async (req, res) => {
    const Today = new Date();
    Today.setHours(0, 0, 0, 0); // Set to the start of today
    const todayISO = Today.toISOString();

    const { count, error } = await supabase
        .from('Users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ newUsersToday: count });
};

export const getUsersGrowth = async (req, res) => {

    try{
        const today = new Date();

    const firstDayOfThisWeek = new Date(today);
    firstDayOfThisWeek.setDate(today.getDate() - today.getDay() + 1);
    firstDayOfThisWeek.setHours(0, 0, 0, 0);

    const firstDayofLastWeek = new Date(firstDayOfThisWeek);
    firstDayofLastWeek.setDate(firstDayOfThisWeek.getDate() - 7);

    const endofLastWeek = new Date(firstDayOfThisWeek);
    endofLastWeek.setMilliseconds(-1);

    const { count: thisWeekCount, error: thisWeekError } = await supabase
        .from('Users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfThisWeek.toISOString());

    if (thisWeekError) {
        return res.status(500).json({ error: thisWeekError.message });
    }

    const { count: lastWeekCount, error: lastWeekError } = await supabase
        .from('Users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayofLastWeek.toISOString())
        .lte('created_at', endofLastWeek.toISOString());    

    if (lastWeekError) {
        return res.status(500).json({ error: lastWeekError.message });
    }

    let growthRate = 0;
    if (lastWeekCount > 0) {
        growthRate = ((thisWeekCount-lastWeekCount)/lastWeekCount) * 100;
    }

    res.json({ 
        usersLastWeek: lastWeekCount,
        newUsersThisWeek: thisWeekCount,
        userGrowthRate: growthRate.toFixed(2) + "%"
     });

    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
    
};

export const getUserEngagement = async (req, res) => {
    try{
        const { count: totalUsers, error: totalUsersError } = await supabase
            .from('Users')
            .select('*', { count: 'exact', head: true });
            if(totalUsersError) throw totalUsersError;
            
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: activeOrders, error: activeError } = await supabase
            .from('orders')
            .select('user_id')
            .gte('created_at', thirtyDaysAgo.toISOString())
        
        if(activeError) throw activeError;

        const uniqueActiveUsers = new Set(activeOrders.map(order => order.user_id)).size;

        const activeUserRate = totalUsers > 0 ? ((uniqueActiveUsers / totalUsers) * 100).toFixed(2) : 0;

        const {count: totalOrders, error: totalError} = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });
        if(totalError) throw totalError;

        const {count: pendingOrders, error: pendingError} = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
        if(pendingError) throw pendingError;

        const cartAbondonmentRate = totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(2) : 0;

        res.json({
            totalUsers,
            uniqueActiveUsers,
            activeUserRate: activeUserRate + "%",
            pendingOrders,
            cartAbondonmentRate: cartAbondonmentRate + "%"
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }

};

export const getAllUsers = async (req,res) =>{
    try{
        const {data, error} = await supabase
        .from("Users")
        .select(`
            id, 
            name, 
            email, 
            role, 
            created_at, 
            status, 
            users_info (
            avatar, 
            rentals, 
            total_spend
            )`);
        if(error) throw error;
        const formattedData = data.map(user =>{
            const rawinfo = user.users_info;
            let info = {};

            if(!rawinfo){
                info = {};
            }else if(Array.isArray(rawinfo)){
                info = rawinfo[0] || {};
            }else{
                info = rawinfo;
            }

            return{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                status: user.status,
                avatar: info.avatar ?? null,
                rentals: info.rentals,
                total_spend: info.total_spend
            }
        });
        res.json(formattedData);

    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
};

export const conversionRate = async (req, res) => {
    try {
        const { count: totalUsers, error: totalUsersError } = await supabase
            .from('Users')
            .select('*', { count: 'exact', head: true });
        if (totalUsersError) throw totalUsersError;
        const { count: usersWithPurchases, error: purchaseError } = await supabase
            .from('orders')
            .select('user_id', { count: 'exact', head: true })
            .neq('status', 'cancelled');
        if (purchaseError) throw purchaseError;

        const conversionRate = totalUsers > 0 ? ((usersWithPurchases / totalUsers) * 100).toFixed(2) : 0;
        res.json({ conversionRate: conversionRate + "%" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUserLocationsInsights = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users_info')
            .select('location');
        if (error) throw error;
        const locationCounts = {};
        data.forEach(user => {
            const location = user.location || 'Unknown';
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        });
        res.json(locationCounts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const topUserLocations = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users_info')
            .select('location, total_spend');
        if (error) throw error;
        const locationCounts = {};  
        data.forEach(user => {
            const location = user.location || 'Unknown';
            const revenue = user.total_spend || 0;
            
            if(!locationCounts[location]){
                locationCounts[location] = {userCount: 0, totalRevenue: 0};
            }
            locationCounts[location].userCount += 1;
            locationCounts[location].totalRevenue += revenue;

        });
        const sortedLocations = Object.entries(locationCounts)
            .sort((a, b) => b[1].userCount - a[1].userCount)
            .slice(0, 5)
            .map(([city, stats]) => ({ city, userCount: stats.userCount, revenue: stats.totalRevenue }));
        res.json({topLocations:sortedLocations});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const topMarketbyUserSpend = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users_info')
            .select('location, total_spend');
        if (error) throw error;
        const locationRevenue = {}; 
        data.forEach(user => {
            const location = user.location || 'Unknown';
            const revenue = user.total_spend || 0;
            locationRevenue[location] = (locationRevenue[location] || 0) + revenue
        });
        const sortedLocations = Object.entries(locationRevenue)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city, revenue]) => ({ city, revenue }));
        res.json({topMarkets:sortedLocations});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// export const userConcentrationByLocation = async (req, res) => {
//     try {
//         const { data, error } = await supabase
//             .from('users_info')
//             .select('location');
//         if (error) throw error;
//         const locationCounts = {};
//         data.forEach(user => {
//             const location = user.location || 'Unknown';
//             locationCounts[location] = (locationCounts[location] || 0) + 1;
//         });
//         const formattedData = Object.entries(locationCounts).map(([location, count]) => ({
//             location,
//             userCount: count
//         }));
//         res.json({ userConcentration: formattedData });
//     }
//     catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

export const userandVendorConcentrationByLocation = async (req, res) => {
    try {
        const { data: userData, error: userError } = await supabase
            .from('users_info')
            .select('location');
        if (userError) throw userError;
        const { data: vendorData, error: vendorError } = await supabase
            .from('vendorsData')
            .select('location');
        if (vendorError) throw vendorError;
        const locationCounts = {};
        userData.forEach(user => {
            const location = user.location || 'Unknown';
            if (!locationCounts[location]) {
                locationCounts[location] = { userCount: 0, vendorCount: 0 };
            }
            locationCounts[location].userCount += 1;
        });
        vendorData.forEach(vendor => {
            const location = vendor.location || 'Unknown';
            if (!locationCounts[location]) {
                locationCounts[location] = { userCount: 0, vendorCount: 0 };
            }
            locationCounts[location].vendorCount += 1;
        });
        const formattedData = Object.entries(locationCounts).map(([location, counts]) => ({
            location,
            userCount: counts.userCount,
            vendorCount: counts.vendorCount
        }));
        res.json({ userandVendorConcentration: formattedData });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const marketOpportunity = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users_info')
            .select('location, total_spend');
        if (error) throw error;

        const locationStats = {};
        data.forEach(user => {
            const location = user.location || 'Unknown';
            const revenue = user.total_spend || 0;
            if (!locationStats[location]) {
                locationStats[location] = { userCount: 0, totalRevenue: 0 };
            }
            locationStats[location].userCount += 1;
            locationStats[location].totalRevenue += revenue;
        });        
        const formattedData = Object.entries(locationStats).map(([location, stats]) => ({
            location,
            userCount: stats.userCount,
            totalRevenue: stats.totalRevenue
        }));
        res.json({ marketOpportunity: formattedData });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}   

export const marketPenetration = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users_info')
            .select('location');
        if (error) throw error;
        const locationCounts = {};
        data.forEach(user => {
            const location = user.location || 'Unknown';
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        });
        const formattedData = Object.entries(locationCounts).map(([location, count]) => ({
            location,
            userCount: count
        }));
        res.json({ marketPenetration: formattedData });
    }   
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const revenueDistributionByLocation = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users_info')
            .select('location, total_spend');
        if (error) throw error;
        const locationRevenue = {};
        data.forEach(user => {
            const location = user.location || 'Unknown';
            const revenue = user.total_spend || 0;
            locationRevenue[location] = (locationRevenue[location] || 0) + revenue;
        });
        const formattedData = Object.entries(locationRevenue).map(([location, revenue]) => ({
            location,
            totalRevenue: revenue
        }));
        res.json({ revenueDistribution: formattedData });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUserDetailsById = async (req, res) => {
    
    let rawId = String(req.params.id || '').trim();

    rawId = rawId.replace(/^:+/, ''); // Keep only numeric characters
    const numericId = Number(rawId);
    id = String(id).replace(':','').trim(); // Sanitize input
    const numericID = Number(id);

    if(isNaN(numericID)){
        console.error("Invalid user ID:", id);
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try{
        const {data, error} = await supabase
        .from("Users")
        .select(`
            id,
            name,
            email,
            role,
            created_at,
            status,
            users_info (
            avatar,
            rentals,
            total_spend,
            location
            )`)
        .eq('id', numericID)
        .single();
        if(error) throw error;
        if(!data) return res.status(404).json({ error: "User not found" });

        const info = Array.isArray(data.users_info) ? data.users_info[0] || {} : data.users_info || {};

        const userData = {
            id: data.id,
            name: data.name,
            email: data.email,
            userType: data.role,
            registrationDate: data.created_at,
            status: data.status,
            avatar: info.avatar || null,
            totalRentals: info.rentals || 0,
            totalSpent: info.total_spend || 0,
            location: info.location || null,
        };
        res.json(userData);
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }   
};
