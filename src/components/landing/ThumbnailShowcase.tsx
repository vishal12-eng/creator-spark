import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const thumbnails = [
  {
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop',
    title: 'Gaming Thumbnail',
    ctr: '12.4%',
  },
  {
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=225&fit=crop',
    title: 'Tech Review',
    ctr: '9.8%',
  },
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=225&fit=crop',
    title: 'Fitness Vlog',
    ctr: '11.2%',
  },
  {
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop',
    title: 'Cooking Show',
    ctr: '10.5%',
  },
  {
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
    title: 'Tutorial Video',
    ctr: '8.9%',
  },
  {
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    title: 'Lifestyle Vlog',
    ctr: '13.1%',
  },
];

export const ThumbnailShowcase: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Thumbnails That <span className="gradient-text">Convert</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            See real examples of AI-generated thumbnails that achieved high click-through rates.
          </motion.p>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {thumbnails.map((thumb, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden glass card-hover"
            >
              {/* Thumbnail Image */}
              <div className="relative aspect-video">
                <img
                  src={thumb.image}
                  alt={thumb.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex items-center justify-between">
                <span className="font-medium">{thumb.title}</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {thumb.ctr} CTR
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
