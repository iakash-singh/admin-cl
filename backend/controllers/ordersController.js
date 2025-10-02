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