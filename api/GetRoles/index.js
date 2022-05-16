const fetch = require('node-fetch').default;

// add role names to this object to map them to group ids in your AAD tenant
const roleGroupMappings = {
    //please work
    'reader': '04ca7393-9111-468c-a136-4fdbaef8ac7b'
};

module.exports = async function (context, req) {
    const user = req.body || {};
    const roles = [];
    
    for (const [role, groupId] of Object.entries(roleGroupMappings)) {
        if (await isUserInGroup(groupId, user.accessToken)) {
            roles.push(role);
        }
    }

    context.res.json({
        roles
    });
}

async function isUserInGroup(groupId, bearerToken) {
    const url = new URL(`https://graph.microsoft.com/v1.0/me/memberOf/${groupId}`);
    // url.searchParams.append('$filter', `id eq '${groupId}'`);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`
        },
    });

    await response.json();

    if (response.status == 200) {
        return true;
    }
    else {
        return false;
    }

    // const graphResponse = await response.json();
    // const matchingGroups = graphResponse.value.filter(group => group.id === groupId);
    // return matchingGroups.length > 0;
}
