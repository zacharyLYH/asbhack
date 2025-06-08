'use client'

import { LinkedInProfile } from "@/lib/types"
import { Award, Briefcase, GraduationCap, MapPin } from "lucide-react"

export default function ProfilePage({profile}: {profile: LinkedInProfile}) {

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">No profile found</p>
          <p className="text-sm text-gray-500 mt-1">Unable to load profile data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          {profile.headline && (
            <p className="text-lg text-gray-600 mt-1">{profile.headline}</p>
          )}
          {profile.location && (
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </p>
          )}
        </div>
      </div>

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Experience
          </h2>
          <div className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4">
                <h3 className="font-medium text-gray-900">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
                {exp.duration && (
                  <p className="text-sm text-gray-500">{exp.duration}</p>
                )}
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </h2>
          <div className="space-y-3">
            {profile.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-green-200 pl-4">
                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                {edu.duration && (
                  <p className="text-sm text-gray-500">{edu.duration}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Projects</h2>
          <div className="space-y-3">
            {profile.projects.map((project, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                {project.description && (
                  <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards */}
      {profile.awards && profile.awards.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Awards
          </h2>
          <div className="space-y-3">
            {profile.awards.map((award, index) => (
              <div key={index} className="border-l-2 border-yellow-200 pl-4">
                <h3 className="font-medium text-gray-900">{award.title}</h3>
                <p className="text-gray-600">{award.issuer}</p>
                {award.date && (
                  <p className="text-sm text-gray-500">{award.date}</p>
                )}
                {award.description && (
                  <p className="text-sm text-gray-700 mt-1">{award.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Certifications</h2>
          <div className="space-y-3">
            {profile.certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-900">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer}</p>
                {cert.date && (
                  <p className="text-sm text-gray-500">{cert.date}</p>
                )}
                {cert.credentialId && (
                  <p className="text-xs text-gray-400 mt-1">ID: {cert.credentialId}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Languages</h2>
          <div className="flex flex-wrap gap-3">
            {profile.languages.map((lang, index) => (
              <div key={index} className="bg-indigo-50 px-3 py-2 rounded-lg">
                <span className="font-medium text-indigo-900">{lang.name}</span>
                {lang.proficiency && (
                  <span className="text-sm text-indigo-600 ml-2">({lang.proficiency})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications */}
      {profile.publications && profile.publications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Publications</h2>
          <div className="space-y-3">
            {profile.publications.map((pub, index) => (
              <div key={index} className="border-l-2 border-purple-200 pl-4">
                <h3 className="font-medium text-gray-900">{pub.title}</h3>
                <p className="text-gray-600">{pub.publisher}</p>
                {pub.date && (
                  <p className="text-sm text-gray-500">{pub.date}</p>
                )}
                {pub.description && (
                  <p className="text-sm text-gray-700 mt-1">{pub.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
