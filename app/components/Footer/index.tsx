

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Your App. All rights reserved.</p>
      </div>
    </footer>
  );
}