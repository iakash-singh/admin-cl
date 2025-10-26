import supabaseClient from "../services/supabaseClient.js";

export const getTotalVendors = async (req, res) => {
    const {count, error} = await supabaseClient
    .from('vendorsData')
    .select('*', { count: 'exact', head: true });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ totalVendors: count });
}

export const getPendingApprovals = async (req,res) =>{
    try{
        const {count, error} = await supabaseClient
        .from('vendorsData')
        .select('*', { count: 'exact', head: true })
        .eq("verification", "pending");

        if (error) throw error; 

        res.json({ pendingApprovals: count });
    } catch (error) {
        console.error('Error fetching pending approvals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAverageRevenue = async (req,res) =>{
    try{
        const {data, error} = await supabaseClient
        .from('vendorsData')
        .select('revenue');

        if(error) throw error;

        if(!data || data.length === 0){
            return res.json({ averageRevenue: 0 });
        }

        const totalRevenue = data.reduce((sum, vendor) => sum + (vendor.revenue || 0), 0);
        const averageRevenue = totalRevenue / data.length;
        res.json({ averageRevenue });


    } catch (error) {
        console.error('Error fetching average revenue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getVerificationStatus = async (req, res) => {
    try{
        const {data, error} = await supabaseClient
    .from('vendorsData')
    .select('verification')

    if(error) throw error;
    const counts = {
        verified: 0,
        pending: 0,
        rejected: 0
    }

    data.forEach(vendor => {
        if(vendor.verification === 'completed') counts.verified += 1;
        else if(vendor.verification === 'pending') counts.pending += 1;
        else if(vendor.verification === 'rejected') counts.rejected += 1;
    });
    res.json(counts);
    } catch(err){
        console.error('Error fetching verification status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }   
}

export const getOnboardingStatus = async (req,res) => {
        try{
        const {data, error} = await supabaseClient
        .from('vendorsData')
        .select('onboarding');
        if(error) throw error;

        if(!data || data.length === 0){
            return res.json({ completed: 0, pending: 0, incomplete: 0 });
        }

        const stats = {
            completed: data.filter(vendor => vendor.onboarding === 'completed').length,
            pending: data.filter(vendor => vendor.onboarding === 'pending').length,
            incomplete: data.filter(vendor => vendor.onboarding === 'incomplete').length,
        };

        res.json(stats);
        }
    catch(err){
        console.error('Error fetching onboarding status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllVendors = async (req,res) =>{
    try{
        const {data, error} = await supabaseClient
        .from('vendorsData')
        .select('*');
        if(error) throw error;
        
        const formattedData = data.map(v =>({
            buisnessName: v.business_name || '',
            ownerName: v.owner || '',
            category: v.category || '',
            verificationStatus: v.verification || '',
            onboardingStatus: v.onboarding || '',
            products: v.products || 0,
            rating: v.rating || 0,
            revenue: v.revenue || 0,
        }))
        res.json(formattedData);

    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
}