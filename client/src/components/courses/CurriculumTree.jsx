import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Lock,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';

const formatDuration = (seconds) => {
  if (!seconds) return '5m';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs > 0 ? secs + 's' : ''}`;
};

const CurriculumTree = ({
  chapters = [],
  activeLessonId = null,
  completedLessonIds = [],
  onSelectLesson,
  isEnrolled = false,
  showPreviewAction = true,
}) => {
  const [openChapters, setOpenChapters] = useState(
    chapters.reduce((acc, ch) => ({ ...acc, [ch._id]: true }), {})
  );

  const toggleChapter = (chId) => {
    setOpenChapters((prev) => ({ ...prev, [chId]: !prev[chId] }));
  };

  return (
    <div className="space-y-3">
      {chapters.map((chapter, chIndex) => {
        const isOpen = openChapters[chapter._id] !== false;
        const totalLessons = chapter.lessons?.length || 0;
        const totalDurationSecs = (chapter.lessons || []).reduce(
          (acc, l) => acc + (l.duration || 300),
          0
        );

        return (
          <div
            key={chapter._id || chIndex}
            className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 rounded-xl overflow-hidden transition-colors shadow-sm"
          >
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter._id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                  {chIndex + 1}
                </span>
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                  {chapter.title}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {totalLessons} lessons • {formatDuration(totalDurationSecs)}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {/* Lesson List */}
            {isOpen && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
                {(chapter.lessons || []).map((lesson, lIndex) => {
                  const isActive = activeLessonId === lesson._id;
                  const isCompleted = completedLessonIds.includes(lesson._id);
                  const canAccess = isEnrolled || lesson.isFreePreview;

                  return (
                    <div
                      key={lesson._id || lIndex}
                      onClick={() => {
                        if (canAccess && onSelectLesson) {
                          onSelectLesson(lesson);
                        }
                      }}
                      className={`flex items-center justify-between px-5 py-3.5 text-xs transition-all ${
                        canAccess ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
                      } ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-l-4 border-indigo-500 text-indigo-900 dark:text-white font-semibold'
                          : 'hover:bg-slate-100/80 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : canAccess ? (
                          <PlayCircle
                            className={`w-4 h-4 flex-shrink-0 ${
                              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                            }`}
                          />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        )}

                        <span className="line-clamp-1">
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {lesson.isFreePreview && !isEnrolled && showPreviewAction && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-500/30">
                            Preview
                          </span>
                        )}
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(lesson.duration)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CurriculumTree;
