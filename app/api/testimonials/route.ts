import { NextResponse } from 'next/server'
import { supabaseServer } from '@/supabase/server'

export async function GET() {
  try {
    console.log('=== SUPABASE TESTIMONIALS API ===')
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    })
    
    // Get submissions from Supabase
    const { data: submissionsData, error } = await supabaseServer
      .from('feedback_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })
    
    console.log('Supabase testimonials query result:', {
      hasData: !!submissionsData,
      dataLength: submissionsData?.length || 0,
      hasError: !!error,
      error: error?.message
    })
    
    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({
        success: true,
        data: []
      })
    }
    
    // Process submissions for the new clean schema
    const submissions = submissionsData?.map((sub: any) => {
      // Ensure JSONB array fields are properly handled
      if (sub.benefits_experienced && !Array.isArray(sub.benefits_experienced)) {
        try {
          sub.benefits_experienced = JSON.parse(sub.benefits_experienced)
        } catch {
          sub.benefits_experienced = []
        }
      }
      
      if (sub.lifestyle_impact && !Array.isArray(sub.lifestyle_impact)) {
        try {
          sub.lifestyle_impact = JSON.parse(sub.lifestyle_impact)
        } catch {
          sub.lifestyle_impact = []
        }
      }
      
      // Ensure numeric fields are numbers (they should already be integers from the new schema)
      sub.overall_satisfaction = Number(sub.overall_satisfaction) || 0
      
      return sub
    }) || []
    
    console.log('Loaded and processed submissions for testimonials:', submissions.length)
    
    if (submissions.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }
    
    // Filter for testimonials - users who gave permission and have good ratings
    const testimonials = submissions
      .filter((sub: any) => {
        const hasPermission = sub.testimonial_permission && 
          (sub.testimonial_permission.includes('Yes') || sub.testimonial_permission.includes('Proud'))
        const hasGoodRating = sub.overall_satisfaction >= 4
        const hasEnoughData = sub.first_name && sub.overall_satisfaction
        
        return hasPermission && hasGoodRating && hasEnoughData
      })
      .map((sub: any) => {
        const firstName = sub.first_name || 'Anonymous'
        const lastName = sub.last_name || ''
        const fullName = `${firstName} ${lastName}`.trim()
        const initials = `${firstName.charAt(0)}${lastName.charAt(0) || ''}`.toUpperCase()
        
        // Generate natural testimonial content from feedback data
        const testimonialContent = generateTestimonialContent(sub)
        const testimonialTitle = generateTestimonialTitle(sub)
        const beforeAfter = generateBeforeAfterScenario(sub)
        
        return {
          id: sub.id,
          name: fullName,
          age: sub.age || null,
          location: sub.city ? `${sub.city}, India` : 'India',
          rating: sub.overall_satisfaction,
          title: testimonialTitle,
          content: testimonialContent,
          image: `/placeholder.svg?height=60&width=60&text=${initials}`,
          verified: true,
          beforeAfter: beforeAfter,
          submitted_at: sub.submitted_at
        }
      })
      .sort((a: any, b: any) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()) // Sort by newest first
      .slice(0, 10) // Limit to 10 testimonials
    
    console.log('Generated enhanced testimonials:', testimonials.length)
    
    return NextResponse.json({
      success: true,
      data: testimonials
    })
    
  } catch (err) {
    console.error('Testimonials API error:', err)
    return NextResponse.json(
      { error: 'Testimonials API error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function generateTestimonialContent(submission: any): string {
  const {
    first_name,
    pain_severity,
    benefits_experienced,
    effect_speed,
    overall_satisfaction,
    lifestyle_impact,
    confidence_boost,
    current_feeling,
    final_thoughts
  } = submission

  // Start with a personal touch
  let content = `Hi, I'm ${first_name}! `
  
  // Add pain severity context
  if (pain_severity) {
    if (pain_severity.includes('Severe')) {
      content += `I used to suffer from unbearable period cramps that would leave me bedridden for days. `
    } else if (pain_severity.includes('Moderate')) {
      content += `I struggled with moderate period pain that would disrupt my daily routine. `
    } else if (pain_severity.includes('Mild')) {
      content += `Even though my period pain was mild, it was still annoying and affected my mood. `
    }
  }
  
  // Add benefits experienced
  if (benefits_experienced && benefits_experienced.length > 0) {
    content += `But since trying Period Calm, I've experienced amazing relief! `
    
    if (benefits_experienced.includes('Cramp relief')) {
      content += `My cramps are now completely manageable. `
    }
    if (benefits_experienced.includes('Mood improvement')) {
      content += `My mood has improved significantly during my periods. `
    }
    if (benefits_experienced.includes('Better sleep')) {
      content += `I can sleep much better now without pain interrupting my rest. `
    }
  }
  
  // Add effect speed
  if (effect_speed) {
    if (effect_speed.includes('0-10 minutes')) {
      content += `The relief comes within minutes - it's like magic! `
    } else if (effect_speed.includes('10-20 minutes')) {
      content += `I feel relief within 10-20 minutes of taking it. `
    } else if (effect_speed.includes('20-30 minutes')) {
      content += `It takes about 20-30 minutes to feel the full effect. `
    }
  }
  
  // Add lifestyle impact
  if (lifestyle_impact && lifestyle_impact.length > 0) {
    if (lifestyle_impact.includes('Could work normally')) {
      content += `Now I can work normally during my periods without any issues. `
    }
    if (lifestyle_impact.includes('Could exercise')) {
      content += `I can even exercise and maintain my active lifestyle! `
    }
    if (lifestyle_impact.includes('Better sleep quality')) {
      content += `My sleep quality has improved so much. `
    }
  }
  
  // Add confidence boost
  if (confidence_boost) {
    if (confidence_boost.includes('significantly')) {
      content += `I feel so much more confident and in control during my periods. `
    } else if (confidence_boost.includes('somewhat')) {
      content += `I feel more confident about managing my period symptoms. `
    }
  }
  
  // Add current feeling
  if (current_feeling) {
    content += `Right now, I'm feeling ${current_feeling}! `
  }
  
  // Add final thoughts if available
  if (final_thoughts && final_thoughts.trim().length > 10) {
    content += final_thoughts
  } else {
    // Default closing
    content += `Period Calm has truly transformed my period experience. I highly recommend it to every woman who struggles with period pain!`
  }
  
  return content
}

function generateTestimonialTitle(submission: any): string {
  const { overall_satisfaction, benefits_experienced, pain_severity, current_feeling } = submission
  
  if (overall_satisfaction === 5) {
    if (pain_severity && pain_severity.includes('Severe')) {
      return 'Life-changing relief!'
    } else if (benefits_experienced && benefits_experienced.includes('Cramp relief')) {
      return 'Pain-free periods at last!'
    } else if (current_feeling && current_feeling.includes('amazing')) {
      return 'Absolutely amazing!'
    } else {
      return 'Game-changer for my periods!'
    }
  } else if (overall_satisfaction === 4) {
    return 'Really helpful!'
  } else {
    return 'Great experience!'
  }
}

function generateBeforeAfterScenario(submission: any): { before: string; after: string } {
  const { pain_severity, benefits_experienced, lifestyle_impact, confidence_boost } = submission
  
  let before = 'Period pain and discomfort'
  let after = 'Relief and comfort'
  
  // Before scenario based on pain severity
  if (pain_severity) {
    if (pain_severity.includes('Severe')) {
      before = 'Severe cramps, couldn\'t function'
    } else if (pain_severity.includes('Moderate')) {
      before = 'Moderate pain, needed help'
    } else if (pain_severity.includes('Mild')) {
      before = 'Mild discomfort, mood affected'
    }
  }
  
  // After scenario based on benefits and lifestyle impact
  if (benefits_experienced && benefits_experienced.includes('Cramp relief')) {
    after = 'Pain-free, comfortable periods'
  } else if (lifestyle_impact && lifestyle_impact.includes('Could work normally')) {
    after = 'Productive, normal daily activities'
  } else if (lifestyle_impact && lifestyle_impact.includes('Could exercise')) {
    after = 'Active lifestyle maintained'
  } else if (confidence_boost && confidence_boost.includes('significantly')) {
    after = 'Confident and in control'
  }
  
  return { before, after }
} 