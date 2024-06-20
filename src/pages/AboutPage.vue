<template>
  <div class="about-page">
    <h1>About Us</h1>
    
    <section class="project-summary">
      <h2>Our Project: Rachel's Recipes Website</h2>
      <p>{{ projectDescription }}</p>
    </section>
    
    <section class="team">
      <h2>Meet Our Development Team</h2>
      <div class="team-member" v-for="member in teamMembers" :key="member.name">
        <h3>{{ member.name }}</h3>
        <p>{{ member.description }}</p>
        <ul>
          <li v-for="skill in member.skills" :key="skill">{{ skill }}</li>
        </ul>
      </div>
    </section>
    
    <section class="contact">
      <h2>Get in Touch</h2>
      <p>{{ contactInfo }}</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      projectDescription: `"Rachel's Recipes Website" is an innovative platform that bridges traditional cuisine with the digital age. We offer a unique experience that combines advanced technology with beloved home flavors. Our project allows users to discover, save, and share family recipes using an intuitive and user-friendly interface. With "Grandma's Recipes and More," we're preserving culinary heritage and bringing it to the next generation.`,
      teamMembers: [
        {
          name: 'Guy Biton',
          description: 'A Software and Information Systems Engineering student at Ben-Gurion University of the Negev, specializing in Cybersecurity and Information Security.',
          skills: ['Java', 'C', 'C#', 'Data Structures', 'Cybersecurity', 'Information Security Analysis']
        },
        {
          name: 'Dan Vaitzman',
          description: 'A third-year Information Systems Engineering student at Ben-Gurion University, passionate about software development and innovative technologies.',
          skills: ['Algorithms', 'Data Structures', 'Object-Oriented Programming (OOP)', 'Java', 'SQL']
        }
      ],
      contactInfo: 'For questions, suggestions, or collaborations, please reach out to us through our LinkedIn profiles or via the contact form on this website.'
    }
  }
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  /* padding: 20px; */
  font-family: Arial, sans-serif;
}

h1, h2, h3 {
  color: #2c3e50;
}

.project-summary, .team, .contact {
  margin-bottom: 30px;
}

.team-member {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  display: inline-block;
  background-color: #e0e0e0;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 15px;
}
</style>