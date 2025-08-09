
export const userDetails = async (id: string) => {
  const query = `
    query ($id: ID!) {
      user(id: $id) {
        id
        name
        avatar
        email
        role
      }
    }
  `;

  try {
    const ref = await fetch('https://api.escuelajs.co/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { id }  
      })
    });

    const data = await ref.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
