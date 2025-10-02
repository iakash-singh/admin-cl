import supabaseClient from "../services/supabaseClient.js";

export const getTotalVendors = async (req, res) => {
    const {count, error} = await supabaseClient
    .from('vendors')
    .select('*', { count: 'exact', head: true });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ totalVendors: count });
}
