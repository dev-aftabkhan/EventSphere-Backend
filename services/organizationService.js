const db = require('../config/mysqlConfig'); // Ensure this is your MySQL connection

const getOrganizations = async () => {
    const query = "SELECT org_profile_loc, org_name, about_us, referral_links FROM organization";
    
    try {
        const [results] = await db.execute(query);
        
        return results.map(org => ({
            organization_image: org.org_profile_loc || "",
            organization_name: org.org_name || "",
            organization_description: org.about_us || "",
            social_media_handles: org.referral_links ? JSON.parse(org.referral_links) : []
        }));
    } catch (error) {
        console.error("Error fetching organizations:", error);
        throw error;
    }
};

module.exports = {
    getOrganizations
};
