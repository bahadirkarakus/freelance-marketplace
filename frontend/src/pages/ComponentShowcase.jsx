import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../components/Card';
import Badge, { StatusBadge } from '../components/Badge';
import { SkeletonGrid, SkeletonList } from '../components/SkeletonCard';

/**
 * Component Showcase - Tailwind CSS best practices demonstration
 * 
 * Bu sayfa tüm reusable componentleri ve Tailwind kullanımlarını sergiler:
 * ✅ Reusable UI Components (Button, Input, Card, Badge)
 * ✅ State'e bağlı styling (hover, focus, disabled)
 * ✅ Transition & animations (hover effects, skeleton loading)
 * ✅ Responsive design (grid, breakpoints)
 * ✅ Dark mode support
 */
const ComponentShowcase = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [showSkeleton, setShowSkeleton] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          🎨 Component Showcase
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          Tailwind CSS best practices ve reusable components demo
        </p>

        {/* Buttons Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1️⃣ Button Component - Hover & Transition Effects</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="success">Success Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ✨ <strong>Tailwind Features:</strong> hover:scale-105, transition-all duration-200, 
                focus:ring-2, disabled:opacity-50
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2️⃣ Input Component - Focus & Error States</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Normal Input"
                placeholder="Type something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Email Input"
                type="email"
                placeholder="email@example.com"
                required
              />
              <Input
                label="Input with Error"
                placeholder="Invalid input"
                error="This field is required"
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ✨ <strong>Tailwind Features:</strong> focus:ring-2 focus:ring-blue-500, 
                border-red-500 (error state), transition-all
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Badge Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3️⃣ Badge Component - State-based Styling</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Basic Badges:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="purple">Purple</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status Badges (State-based):</p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="open" />
                  <StatusBadge status="in_progress" />
                  <StatusBadge status="completed" />
                  <StatusBadge status="cancelled" />
                  <StatusBadge status="pending" />
                  <StatusBadge status="accepted" />
                  <StatusBadge status="rejected" />
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ✨ <strong>Tailwind Features:</strong> Dinamik renk değişimi, dark mode variants, 
                bg-emerald-100 text-emerald-700
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Card Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardTitle className="mb-4">Hoverable Card</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Bu card üzerine geldiğinde shadow ve translate efekti göreceksiniz.
            </p>
          </Card>
          <Card hover={false}>
            <CardTitle className="mb-4">Static Card</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Bu card'da hover efekti yok.
            </p>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card with Sections</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600 dark:text-gray-400">
                Header, Body ve Footer bölümleri var.
              </p>
            </CardBody>
            <CardFooter>
              <Button variant="primary" size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-8">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ✨ <strong>Tailwind Features:</strong> hover:shadow-xl hover:-translate-y-1 
            transition-all duration-300
          </p>
        </div>

        {/* Skeleton Loading */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>4️⃣ Skeleton Loading - animate-pulse</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSkeleton(!showSkeleton)}
              >
                {showSkeleton ? 'Hide' : 'Show'} Skeleton
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {showSkeleton ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Grid Layout:
                </h3>
                <SkeletonGrid count={3} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                  List Layout:
                </h3>
                <SkeletonList count={3} />
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                "Show Skeleton" butonuna tıklayın
              </p>
            )}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ✨ <strong>Tailwind Features:</strong> animate-pulse, bg-gray-200 dark:bg-gray-700
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Responsive Grid */}
        <Card>
          <CardHeader>
            <CardTitle>5️⃣ Responsive Grid Layout</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div 
                  key={num}
                  className="bg-gradient-to-br from-blue-400 to-purple-500 text-white p-6 rounded-lg text-center font-bold hover:scale-105 transition-transform"
                >
                  Item {num}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ✨ <strong>Tailwind Features:</strong> grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                lg:grid-cols-4 (responsive breakpoints)
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Summary */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">📊 Tailwind Best Practices Kullanıldı:</h2>
          <ul className="space-y-2 text-lg">
            <li>✅ Reusable UI Components (Button, Input, Card, Badge)</li>
            <li>✅ State'e bağlı styling (hover, focus, disabled, error)</li>
            <li>✅ Transition & Animations (hover:scale-105, animate-pulse)</li>
            <li>✅ Responsive Design (sm:, md:, lg: breakpoints)</li>
            <li>✅ Dark Mode Support (dark: variants)</li>
            <li>✅ Skeleton Loading States</li>
            <li>✅ Form Validation Visuals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcase;
