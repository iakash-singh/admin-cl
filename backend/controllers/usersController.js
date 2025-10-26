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