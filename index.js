const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON in the request body
app.use(express.json());

app.post('/addTeam', async (req, res) => {
  // Ensure req.body is defined and contains the expected properties
  const { name, sport, players } = req.body;
  const express = require('express');
  const { PrismaClient } = require('@prisma/client');
  
  const prisma = new PrismaClient();
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());
  
  // Add a new team with players
  app.post('/addTeam', async (req, res) => {
    try {
      const { name, sport, players } = req.body;
  
      const newTeam = await prisma.team.create({
        data: {
          name,
          sport,
          players: {
            create: players,
          },
        },
        include: {
          players: true,
        },
      });
  
      res.status(201).json({ message: 'Team added successfully', team: newTeam });
    } catch (error) {
      console.error(`Error adding team: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Update a team with players
  app.put('/updateTeam/:teamId', async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId, 10);
      const { name, sport, players } = req.body;
  
      const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: {
          name,
          sport,
          players: {
            upsert: players.map((player) => ({
              where: { id: player.id || undefined },
              update: player,
              create: player,
            })),
          },
        },
        include: {
          players: true,
        },
      });
  
      res.status(200).json({ message: 'Team updated successfully', team: updatedTeam });
    } catch (error) {
      console.error(`Error updating team: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete a team
  app.delete('/deleteTeam/:teamId', async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId, 10);
  
      await prisma.team.delete({
        where: { id: teamId },
      });
  
      res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
      console.error(`Error deleting team: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Fetch teams based on conditions (example: AND, OR)
  app.get('/fetchTeams', async (req, res) => {
    try {
      const { sport, playerPosition, playerCount } = req.query;
  
      const teams = await prisma.team.findMany({
        where: {
          AND: [
            { sport: { contains: sport || '' } },
            {
              OR: [
                { players: { some: { position: { contains: playerPosition || '' } } } },
                { players: { count: { gte: parseInt(playerCount, 10) || 0 } } },
              ],
            },
          ],
        },
        include: {
          players: true,
        },
      });
  
      res.status(200).json({ teams });
    } catch (error) {
      console.error(`Error fetching teams: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
  try {
    const team = await prisma.team.create({
      data: {
        name,
        sport,
        players: {
          create: players,
        },
      },
      include: {
        players: true,
      },
    });

    return res.status(201).json({ message: 'Team added successfully', team });
  } catch (error) {
    console.error(`Error adding team: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to update the RCB team by ID
app.put('/updateTeam/:teamId', async (req, res) => {
    const teamId = parseInt(req.params.teamId, 10);
    const { players } = req.body;
  
    try {
      // Check if the team exists
      const existingTeam = await prisma.team.findUnique({
        where: {
          id: teamId,
        },
        include: {
          players: true,
        },
      });
  
      if (!existingTeam) {
        return res.status(404).json({ error: "Team not found" });
      }
  
      // Update the positions of players
      const updatedTeam = await prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          players: {
            updateMany: players.map((player) => ({
              where: { id: player.id },
              data: { position: player.position },
            })),
          },
        },
        include: {
          players: true,
        },
      });
  
      return res.status(200).json({ message: 'Team and players updated successfully', team: updatedTeam });
    } catch (error) {
      console.error(`Error updating team: ${error.message}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.put('/updateTeam/:teamId', async (req, res) => {
    const teamId = parseInt(req.params.teamId, 10);
    const { name, sport, players } = req.body;
  
    try {
      // Check if the team exists
      const existingTeam = await prisma.team.findUnique({
        where: {
          id: teamId,
        },
        include: {
          players: true,
        },
      });
  
      if (!existingTeam) {
        return res.status(404).json({ error: "Team not found" });
      }
  
      // Update the team information
      const updatedTeam = await prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          name,
          sport,
          players: {
            upsert: players.map((player) => ({
              where: { id: player.id },
              update: player, // Update existing player if exists
              create: player, // Add new player if doesn't exist
            })),
          },
        },
        include: {
          players: true,
        },
      });
  
      return res.status(200).json({ message: 'Team and players updated successfully', team: updatedTeam });
    } catch (error) {
      console.error(`Error updating team: ${error.message}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Assuming you have a route like this
app.get('/indexOfPlayer/:teamId/:playerId', async (req, res) => {
    const teamId = parseInt(req.params.teamId, 10);
    const playerId = parseInt(req.params.playerId, 10);
  
    try {
      // Retrieve the list of players for the specified teamId
      const players = await prisma.player.findMany({
        where: {
          teamId: teamId,
        },
      });
  
      // Find the index of the player with the specified playerId
      const playerIndex = players.findIndex((player) => player.id === playerId);
  
      // Return the result with data
      res.status(200).json({
        message: 'Player index retrieved successfully',
        playerIndex: playerIndex,
        players: players,
      });
    } catch (error) {
      console.error(`Error retrieving player index: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.delete('/deleteTeam/:teamId', async (req, res) => {
    const teamId = parseInt(req.params.teamId, 10);
  
    try {
      // Check if the team exists
      const existingTeam = await prisma.team.findUnique({
        where: {
          id: teamId,
        },
        include: {
          players: true,
        },
      });
  
      if (!existingTeam) {
        return res.status(404).json({ error: "Team not found" });
      }
  
      // Delete the team and associated players
      await prisma.team.delete({
        where: {
          id: teamId,
        },
      });
  
      return res.status(200).json({ message: 'Team and associated players deleted successfully' });
    } catch (error) {
      console.error(`Error deleting team: ${error.message}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.put('/pushPlayers/:teamId', async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId, 10);
      const { players, conditions } = req.body;
  
      // Find the existing team
      const existingTeam = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          players: true,
        },
      });
  
      if (!existingTeam) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      // Modify the players array based on conditions
      const modifiedPlayers = existingTeam.players.filter((player) => {
        // Apply AND conditions
        const andConditionsMet = conditions.and.every((condition) =>
          Object.entries(condition).every(([key, value]) => player[key] === value)
        );
  
        // Apply OR conditions
        const orConditionsMet = conditions.or.some((condition) =>
          Object.entries(condition).some(([key, value]) => player[key] === value)
        );
  
        return andConditionsMet || orConditionsMet;
      });
  
      // Extract unique identifiers from the modified players
      const playerIds = modifiedPlayers.map((player) => ({ id: player.id }));
  
      // Update the team with the modified player IDs
      const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: {
          players: {
            set: playerIds,
          },
        },
        include: {
          players: true,
        },
      });
  
      res.status(200).json({ message: 'Players pushed successfully', team: updatedTeam });
    } catch (error) {
      console.error(`Error pushing players: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
// ... other routes and configurations

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
