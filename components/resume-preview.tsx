'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResumeData } from '@/lib/types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  GraduationCap, 
  Briefcase, 
  Code, 
  CheckCircle,
  Edit,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ResumePreviewProps {
  resumeData: ResumeData;
  onConfirm: () => void;
  onReupload: () => void;
}

export function ResumePreview({ resumeData, onConfirm, onReupload }: ResumePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Resume Info Preview</h2>
        </div>
        <p className="text-slate-300">
          AI has successfully parsed your resume. Please review the extracted information.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Personal Information */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">Name</p>
                    <p className="text-white font-medium">{resumeData.personalInfo.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-green-400" />
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white font-medium">{resumeData.personalInfo.email}</p>
                  </div>
                </div>
                
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-purple-400" />
                    <div>
                      <p className="text-sm text-slate-400">Phone</p>
                      <p className="text-white font-medium">{resumeData.personalInfo.phone}</p>
                    </div>
                  </div>
                )}
                
                {resumeData.personalInfo.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-red-400" />
                    <div>
                      <p className="text-sm text-slate-400">Location</p>
                      <p className="text-white font-medium">{resumeData.personalInfo.location}</p>
                    </div>
                  </div>
                )}
                
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center gap-3 md:col-span-2">
                    <Linkedin className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-slate-400">LinkedIn</p>
                      <p className="text-white font-medium">{resumeData.personalInfo.linkedin}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {resumeData.personalInfo.summary && (
                <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                  <p className="text-sm text-slate-400 mb-2">Professional Summary</p>
                  <p className="text-slate-300 leading-relaxed">{resumeData.personalInfo.summary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills Section ({resumeData.skills.length} skills count)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge 
                      variant="outline" 
                      className="border-blue-400 text-blue-300 hover:bg-blue-400/10 transition-colors duration-200"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education Background */}
        {resumeData.education.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education Background ({resumeData.education.length} education count)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-700/30 rounded-lg"
                  >
                    <h3 className="text-white font-medium">{edu.degree}</h3>
                    <p className="text-slate-300">{edu.school}</p>
                    <p className="text-slate-400 text-sm">{edu.year}</p>
                    {edu.details && (
                      <p className="text-slate-400 text-sm mt-1">{edu.details}</p>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Work Experience */}
        {resumeData.experience.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience ({resumeData.experience.length} positions)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-700/30 rounded-lg"
                  >
                    <h3 className="text-white font-medium">{exp.title}</h3>
                    <p className="text-slate-300">{exp.company}</p>
                    <p className="text-slate-400 text-sm">{exp.duration}</p>
                    <p className="text-slate-300 mt-2 leading-relaxed">{exp.description}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={onConfirm}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-200"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm and Continue
          </Button>
          
          <Button
            onClick={onReupload}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-upload Resume
          </Button>
        </motion.div>

        {/* Info Tip */}
        <motion.div variants={itemVariants}>
          <Alert className="border-blue-500 bg-blue-500/10">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-blue-400">
              <strong>Info Confirmation Tip:</strong><br />
              Please carefully review the extracted information. If any details are incorrect or missing, 
              you can re-upload your resume or the system will use this information for optimization.
            </AlertDescription>
          </Alert>
        </motion.div>
      </motion.div>
    </div>
  );
}