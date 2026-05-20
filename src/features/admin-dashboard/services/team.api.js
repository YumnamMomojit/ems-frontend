import api from '~/services/api';

export const getTeams = async (managerId = null) => {
    try {
        const url = managerId ? `/admin/teams?managerId=${managerId}` : '/admin/teams';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
};

export const createTeam = async (teamData) => {
    try {
        const response = await api.post('/admin/teams', teamData);
        return response.data;
    } catch (error) {
        console.error('Error creating team:', error);
        throw error.response.data;
    }
};
