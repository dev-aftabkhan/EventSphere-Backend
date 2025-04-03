const organizationService = require('../services/organizationService');

const fetchOrganizations = async (req, res) => {
    try {
        const data = await organizationService.getOrganizations();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving organizations", error: error.message });
    }
};

module.exports = {
    fetchOrganizations
};
