import React from 'react';

function FamilySection({ 
  title,
  subtitle,
  qualityTitle,
  description,
  image,
  features = [],
  contentPosition = 'left', // 'left' or 'right'
  backgroundColor = 'bg-gray-50',
  textColor = 'text-gray-900',
  subtitleColor = 'text-gray-600',
  showFeatures = true,
  imageRounded = true,
  imageShadow = true
}) {
  
  const isContentLeft = contentPosition === 'left';
  
  const imageClasses = `
    w-full h-auto
    ${imageRounded ? 'rounded-2xl' : ''}
    ${imageShadow ? 'shadow-2xl' : ''}
  `;

  const ContentBlock = () => (
    <div className="space-y-6">
      <h3 className={`text-3xl font-bold ${textColor} mb-6`}>
        {qualityTitle}
      </h3>
      <p className={`text-lg ${subtitleColor} mb-8 leading-relaxed`}>
        {description}
      </p>
      
      {showFeatures && features.length > 0 && (
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              {feature.icon && (
                <feature.icon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
              )}
              <span className="text-lg font-semibold">{feature.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ImageBlock = () => (
    <div className="relative">
      <img 
        src={image}
        alt={title}
        className={imageClasses}
      />
      {/* Optional overlay or decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-full opacity-10 hidden lg:block"></div>
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-500 rounded-full opacity-10 hidden lg:block"></div>
    </div>
  );

  return (
    <section className={`py-20 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${textColor} mb-6`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-xl ${subtitleColor} max-w-4xl mx-auto leading-relaxed`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {isContentLeft ? (
            <>
              <ContentBlock />
              <ImageBlock />
            </>
          ) : (
            <>
              <ImageBlock />
              <ContentBlock />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default FamilySection;