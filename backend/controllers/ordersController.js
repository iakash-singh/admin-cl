import supabase from "../services/supabaseClient.js";

export const getTotalOrders = async (req, res) => {
    const {count, error} = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ totalOrders: count });
}

export const getActiveOrders = async (req, res) => {
    const {count, error} = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ activeOrders: count });
}

export const getCompletedOrders = async (req, res) => {
    const {count, error} = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Completed');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ completedOrders: count });
};

export const getOrderStatus = async (req, res) => {
    const { data, error } = await supabase
    .from('orders')
    .select('status')

    if(error) {
        return res.status(500).json({ error: error.message });
    }

    const counts = data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {})

    const total = data.length;

    res.json({
        activeOrders: counts.active || counts.Active || 0,
        pendingOrders: counts.pending || counts.Pending || 0,
        disputedOrders: counts.disputed || counts.Disputed || 0,
        completedOrders: counts.completed || counts.Completed || 0,
        totalOrders: total,
    })

    
}

export const getTotalRevenue = async (req, res) => {
    const { data, error } = await supabase
    .from('orders')
    .select('total_amount')

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    const totalRevenue = data.reduce((acc, order) => acc + order.total_amount, 0);
    res.json({ totalRevenue });
}

export const getTodayRevenue = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data, error } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .gte('created_at', today.toISOString());
    if (error) {
        return res.status(500).json({ error: error.message });
    }   
    const todayRevenue = data.reduce((acc, order) => acc + order.total_amount, 0);
    res.json({ todayRevenue });
}

export const getAverageOrderValue = async (req, res) => {
    const { data, error } = await supabase
    .from('orders')
    .select('total_amount');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    const total = data.reduce((acc, order) => acc + order.total_amount, 0);
    const average = total / data.length || 0;

    res.json({ averageOrderValue: average });
}

export const getOrderSuccessRate = async (req, res) => {
    const { data, error } = await supabase
    .from('orders')
    .select('status');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    const total = data.length;
    const successful = data.filter(order => order.status === 'Completed').length;
    const successRate = (successful / total) * 100 || 0;
    res.json({ orderSuccessRate: successRate });
}

export const marketcoverage = async (req, res) => {
    const { data, error } = await supabase
    .from('users_info')
    .select('location');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    const locations = [...new Set(data.map(order => order.location))];
    res.json({ marketCoverage: locations.length });
}

