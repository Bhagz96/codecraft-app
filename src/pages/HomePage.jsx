import { Link } from "react-router-dom";
import lessons from "../data/lessons";

/**
 * HOME PAGE
 * =========
 * The landing page kids see first. Shows:
 * - A fun title and welcome message
 * - A card for each lesson they can pick
 * - A small link to the admin dashboard (for the demo/presentation)
 */
function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-3">
          KidCode Quest
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-medium">
          Learn to think like a computer! 🚀
        </p>
      </header>

      {/* Lesson Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lesson/${lesson.id}`}
            className="group block"
          >
            <div
              className={`
                bg-gradient-to-br ${lesson.color}
                rounded-3xl p-6 text-white
                transform transition-all duration-200
                hover:scale-105 hover:shadow-2xl
                cursor-pointer
              `}
            >
              {/* Lesson icon (big emoji) */}
              <div className="text-6xl mb-4">{lesson.icon}</div>

              {/* Lesson title */}
              <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>

              {/* Concept tag */}
              <span className="inline-block bg-white/30 rounded-full px-3 py-1 text-sm font-semibold mb-3">
                {lesson.concept}
              </span>

              {/* Description */}
              <p className="text-white/90 text-sm">{lesson.description}</p>

              {/* "Start" prompt */}
              <div className="mt-4 text-center">
                <span className="inline-block bg-white text-gray-800 font-bold px-6 py-2 rounded-full text-lg group-hover:bg-yellow-300 transition-colors">
                  Let's Go!
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Admin link (small, at bottom — for presentation purposes) */}
      <Link
        to="/admin"
        className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
      >
        Admin Dashboard →
      </Link>
    </div>
  );
}

export default HomePage;
