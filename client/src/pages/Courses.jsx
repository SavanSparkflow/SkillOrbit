import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import CourseCard from '../components/courses/CourseCard';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

const categories = [
  'All',
  'Web Development',
  'Mobile Development',
  'Data Science & AI',
  'UI/UX Design',
  'Cloud & DevOps',
  'Cybersecurity',
];

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses, total, loading, fetchCourses } = useCourseStore();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get('level') || 'All'
  );
  const [priceType, setPriceType] = useState(searchParams.get('price') || 'all');
  const [sort, setSort] = useState('popular');

  useEffect(() => {
    const params = {
      sort,
      ...(search && { search }),
      ...(selectedCategory !== 'All' && { category: selectedCategory }),
      ...(selectedLevel !== 'All' && { level: selectedLevel }),
      ...(priceType !== 'all' && { price: priceType }),
    };

    fetchCourses(params);
  }, [search, selectedCategory, selectedLevel, priceType, sort, fetchCourses]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (search) newParams.set('search', search);
    else newParams.delete('search');
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Page Header */}
      <div className="space-y-2">
        <Badge variant="indigo">Course Catalog</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Explore All Courses
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Advance your engineering and design capabilities with project-based masterclasses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center shadow-sm">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </form>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Level */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-slate-100 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                Level: {lvl}
              </option>
            ))}
          </select>

          {/* Price */}
          <select
            value={priceType}
            onChange={(e) => setPriceType(e.target.value)}
            className="bg-slate-100 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Price: All</option>
            <option value="free">Free Courses</option>
            <option value="paid">Premium Paid</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-100 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course List Results */}
      {loading ? (
        <Loading text="Loading course library..." />
      ) : courses.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Showing {courses.length} of {total} courses</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No courses found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedLevel('All');
              setPriceType('all');
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
