function normalizeSkills(skills: string[]) {
    return skills.map((skill) => skill.trim().toLowerCase());
}

export function getMatchedSkills(userSkills: string[], jobSkills: string[]) {
    const normalizedUserSkills = normalizeSkills(userSkills);
    const normalizedJobSkills = normalizeSkills(jobSkills);

    return normalizedJobSkills.filter((skill) =>
        normalizedUserSkills.includes(skill),
    );
}
