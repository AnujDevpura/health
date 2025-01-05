import { useEffect, useState } from "react";
import { ethers } from "ethers";

const ProjectRegistryApp = ({ contract }) => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current project index
  const [userVotes, setUserVotes] = useState({}); // Track votes per user per project
  const [loading, setLoading] = useState(true);

  // Fetch all projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      const [addresses, names, githubLinks, youtubeLinks, credits] = await contract.getAllProjects();

      const projectList = addresses.map((address, index) => ({
        address,
        name: names[index],
        github: githubLinks[index],
        youtube: youtubeLinks[index],
        credits: credits[index].toString(),
      }));

      setProjects(projectList);
      setLoading(false);
    };

    fetchProjects();
  }, [contract]);

  // Handle voting for a project
  const voteForProject = async (projectAddress) => {
    const votes = userVotes[projectAddress] || 0;
    const newVotes = votes + 1;
    const quadraticCredits = Math.pow(newVotes, 2);

    // Update local state for user votes
    setUserVotes({
      ...userVotes,
      [projectAddress]: newVotes,
    });

    // Calculate total credits and send to smart contract
    const totalCredits =
      parseInt(projects[currentIndex].credits) + quadraticCredits;

    try {
      const tx = await contract.updateCredits(projectAddress, totalCredits);
      await tx.wait();

      alert("Credits updated successfully!");

      // Move to the next project
      if (currentIndex + 1 < projects.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("All projects have been voted on!");
      }
    } catch (err) {
      console.error("Error updating credits:", err);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  if (currentIndex >= projects.length)
    return <div>All projects have been displayed!</div>;

  // Display current project details
  const currentProject = projects[currentIndex];

  return (
    <div>
      <h1>Project Registry</h1>
      <div key={currentIndex}>
        <h2>{currentProject.name}</h2>
        <p>
          GitHub:{" "}
          <a
            href={currentProject.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentProject.github}
          </a>
        </p>
        <p>
          YouTube:{" "}
          <a
            href={currentProject.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentProject.youtube}
          </a>
        </p>
        <p>Credits: {currentProject.credits}</p>
        <button onClick={() => voteForProject(currentProject.address)}>
          Vote
        </button>
      </div>
    </div>
  );
};

export default ProjectRegistryApp;
