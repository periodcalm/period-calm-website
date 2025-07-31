import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  try {
    console.log('=== EXPORT FEEDBACK API ===')
    
    // Get submissions from KV
    let submissions: any[] = []
    try {
      const existingData = await kv.get('feedback-submissions')
      if (existingData) {
        submissions = existingData as any[]
        console.log('Export: Loaded', submissions.length, 'submissions from KV')
      } else {
        console.log('Export: No data in KV, returning empty export')
        return NextResponse.json({
          success: false,
          message: 'No feedback data available to export'
        })
      }
    } catch (kvError) {
      console.error('Export: Error reading from KV:', kvError)
      return NextResponse.json({
        success: false,
        message: 'No feedback data available to export'
      })
    }
    
    if (submissions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No feedback data available to export'
      })
    }
    
    // Create CSV content
    const headers = [
      'ID',
      'First Name',
      'Last Name',
      'Email',
      'Age',
      'Phone',
      'City',
      'State',
      'Instagram',
      'Cycle Length',
      'Last Period Date',
      'Period Regularity',
      'Previous Pain Management',
      'Pain Severity',
      'When Tried',
      'Timing of Use',
      'Frequency of Use',
      'Preparation Method',
      'Effect Speed',
      'Overall Satisfaction',
      'Would Drink Again',
      'Benefits Experienced',
      'Side Effects',
      'Taste Rating',
      'Value Rating',
      'Packaging Rating',
      'Convenience Rating',
      'Storage Experience',
      'Dosage Followed',
      'Budget Range',
      'Price Points',
      'Purchase Intent',
      'Lifestyle Impact',
      'Self Care Essentials',
      'Current Feeling',
      'Confidence Boost',
      'Face and Soul Campaign',
      'Community Interest',
      'Volunteer Interest',
      'Testimonial Permission',
      'Improvements',
      'Would Recommend',
      'Price Feedback',
      'Final Thoughts',
      'Submitted At',
      'Source'
    ]
    
    const csvRows = [headers.join(',')]
    
    submissions.forEach(sub => {
      const row = [
        sub.id || '',
        `"${(sub.first_name || '').replace(/"/g, '""')}"`,
        `"${(sub.last_name || '').replace(/"/g, '""')}"`,
        sub.email || '',
        sub.age || '',
        sub.phone || '',
        `"${(sub.city || '').replace(/"/g, '""')}"`,
        sub.state || '',
        sub.instagram || '',
        `"${(sub.cycle_length || '').replace(/"/g, '""')}"`,
        `"${(sub.last_period_date || '').replace(/"/g, '""')}"`,
        `"${(sub.period_regularity || '').replace(/"/g, '""')}"`,
        `"${(sub.previous_pain_management || '').replace(/"/g, '""')}"`,
        `"${(sub.pain_severity || '').replace(/"/g, '""')}"`,
        `"${(sub.when_tried || '').replace(/"/g, '""')}"`,
        `"${(sub.timing_of_use || '').replace(/"/g, '""')}"`,
        `"${(sub.frequency_of_use || '').replace(/"/g, '""')}"`,
        `"${(sub.preparation_method || '').replace(/"/g, '""')}"`,
        `"${(sub.effect_speed || '').replace(/"/g, '""')}"`,
        sub.overall_satisfaction || '',
        `"${(sub.would_drink_again || '').replace(/"/g, '""')}"`,
        `"${Array.isArray(sub.benefits_experienced) ? sub.benefits_experienced.join('; ') : (sub.benefits_experienced || '')}"`,
        `"${(sub.side_effects || '').replace(/"/g, '""')}"`,
        sub.taste_rating || '',
        sub.value_rating || '',
        sub.packaging_rating || '',
        sub.convenience_rating || '',
        `"${(sub.storage_experience || '').replace(/"/g, '""')}"`,
        `"${(sub.dosage_followed || '').replace(/"/g, '""')}"`,
        `"${(sub.budget_range || '').replace(/"/g, '""')}"`,
        `"${(sub.price_points || '').replace(/"/g, '""')}"`,
        `"${(sub.purchase_intent || '').replace(/"/g, '""')}"`,
        `"${Array.isArray(sub.lifestyle_impact) ? sub.lifestyle_impact.join('; ') : (sub.lifestyle_impact || '')}"`,
        `"${Array.isArray(sub.self_care_essentials) ? sub.self_care_essentials.join('; ') : (sub.self_care_essentials || '')}"`,
        `"${(sub.current_feeling || '').replace(/"/g, '""')}"`,
        `"${(sub.confidence_boost || '').replace(/"/g, '""')}"`,
        `"${(sub.face_and_soul_campaign || '').replace(/"/g, '""')}"`,
        `"${(sub.community_interest || '').replace(/"/g, '""')}"`,
        `"${(sub.volunteer_interest || '').replace(/"/g, '""')}"`,
        `"${(sub.testimonial_permission || '').replace(/"/g, '""')}"`,
        `"${(sub.improvements || '').replace(/"/g, '""')}"`,
        `"${(sub.would_recommend || '').replace(/"/g, '""')}"`,
        `"${(sub.price_feedback || '').replace(/"/g, '""')}"`,
        `"${(sub.final_thoughts || '').replace(/"/g, '""')}"`,
        sub.submitted_at || '',
        sub.source || ''
      ]
      csvRows.push(row.join(','))
    })
    
    const csvContent = csvRows.join('\n')
    const filename = `period-calm-feedback-${new Date().toISOString().split('T')[0]}.csv`
    
    console.log('Export: Generated CSV with', submissions.length, 'submissions')
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    })
    
  } catch (err) {
    console.error('Export feedback error:', err)
    return NextResponse.json(
      { error: 'Failed to export feedback', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 