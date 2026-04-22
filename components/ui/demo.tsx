import TestimonialGrid from '@/components/ui/testimonial'

export default function DemoOne() {
  return (
    <TestimonialGrid
      items={[
        {
          id: '1',
          imageSrc: '/static/images/avatar.png',
          quote: 'Demo saturs',
          name: 'John Doe',
          role: 'Content Marketing',
        },
      ]}
    />
  )
}
