/*
  # Add Sample Data for Medical Website

  1. Sample Data
    - Add sample blog posts in all languages
    - Add sample FAQs in all languages
    - Add sample symptoms in all languages
    - Add sample reviews

  2. Notes
    - All content is in Turkish, Azerbaijani, and English
    - Blog posts are published by default
    - FAQs are approved by default
    - Reviews are approved by default
*/

-- Sample Blog Posts
INSERT INTO blog_posts (
  title_tr, title_az, title_en,
  content_tr, content_az, content_en,
  excerpt_tr, excerpt_az, excerpt_en,
  image_url, published
) VALUES 
(
  'Diz Protezi Ameliyatı Hakkında Bilmeniz Gerekenler',
  'Diz Protezi Əməliyyatı Haqqında Bilməli Olduqlarınız',
  'What You Need to Know About Knee Replacement Surgery',
  
  '<p>Diz protezi ameliyatı, ciddi diz ağrısı ve hareket kısıtlılığı yaşayan hastalar için yaşam kalitesini önemli ölçüde artırabilen yaygın bir prosedürdür.</p><h2>Diz Protezi Ne Zaman Gereklidir?</h2><p>Diz protezi ameliyatı genellikle şu durumlarda önerilir:</p><ul><li>Ciddi artrit sürekli ağrıya neden olduğunda</li><li>Konservatif tedaviler başarısız olduğunda</li><li>Günlük aktiviteler önemli ölçüde etkilendiğinde</li></ul>',
  
  '<p>Diz protezi əməliyyatı, ciddi diz ağrısı və hərəkət məhdudiyyəti yaşayan xəstələr üçün həyat keyfiyyətini əhəmiyyətli dərəcədə artıra bilən geniş yayılmış prosedurdur.</p><h2>Diz Protezi Nə Vaxt Lazımdır?</h2><p>Diz protezi əməliyyatı adətən bu hallarda tövsiyə olunur:</p><ul><li>Ciddi artrit davamlı ağrıya səbəb olduqda</li><li>Konservativ müalicələr uğursuz olduqda</li><li>Gündəlik fəaliyyətlər əhəmiyyətli dərəcədə təsirləndiyi zaman</li></ul>',
  
  '<p>Knee replacement surgery is a common procedure that can significantly improve quality of life for patients suffering from severe knee pain and limited mobility.</p><h2>When is Knee Replacement Necessary?</h2><p>Knee replacement surgery is typically recommended when:</p><ul><li>Severe arthritis causes persistent pain</li><li>Conservative treatments have failed</li><li>Daily activities are significantly impacted</li></ul>',
  
  'Diz protezi ameliyatı hakkında kapsamlı bir rehber. Prosedür, iyileşme süreci ve beklentiler.',
  'Diz protezi əməliyyatı haqqında ətraflı bələdçi. Prosedur, sağalma prosesi və gözləntilər.',
  'A comprehensive guide to knee replacement surgery, recovery process, and expectations.',
  
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  true
),
(
  'Spor Yaralanmaları: Önleme ve Tedavi',
  'İdman Zədələri: Qarşısının Alınması və Müalicəsi',
  'Sports Injuries: Prevention and Treatment',
  
  '<p>Spor yaralanmaları hem atletlerde hem de günlük aktivitelerde yaygındır. Doğru teknikler ve hazırlık ile birçok yaralanma önlenebilir.</p><h2>Yaygın Spor Yaralanmaları</h2><ul><li>ACL yırtıkları</li><li>Menisküs yaralanmaları</li><li>Aşil tendonu yaralanmaları</li></ul>',
  
  '<p>İdman zədələri həm atletlərdə, həm də gündəlik fəaliyyətlərdə geniş yayılmışdır. Düzgün texnikalar və hazırlıq ilə bir çox zədənin qarşısını almaq olar.</p><h2>Geniş Yayılmış İdman Zədələri</h2><ul><li>ACL cırıqları</li><li>Menisk zədələri</li><li>Axil vətəri zədələri</li></ul>',
  
  '<p>Sports injuries are common in both athletes and everyday activities. With proper techniques and preparation, many injuries can be prevented.</p><h2>Common Sports Injuries</h2><ul><li>ACL tears</li><li>Meniscus injuries</li><li>Achilles tendon injuries</li></ul>',
  
  'Spor yaralanmalarından korunma yolları ve tedavi seçenekleri hakkında bilgi.',
  'İdman zədələrindən qorunma yolları və müalicə seçimləri haqqında məlumat.',
  'Information about sports injury prevention methods and treatment options.',
  
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  true
);

-- Sample FAQs
INSERT INTO faqs (
  question_tr, question_az, question_en,
  answer_tr, answer_az, answer_en,
  approved, is_preset
) VALUES 
(
  'Diz protezi ameliyatı ne kadar sürer?',
  'Diz protezi əməliyyatı nə qədər çəkir?',
  'How long does knee replacement surgery take?',
  
  'Diz protezi ameliyatı genellikle vakanın karmaşıklığına bağlı olarak 1-2 saat sürer. Prosedür, hasarlı kıkırdak ve kemiğin çıkarılması, ardından yeni metal ve plastik eklem yüzeylerinin yerleştirilmesini içerir.',
  
  'Diz protezi əməliyyatı adətən işin mürəkkəbliyindən asılı olaraq 1-2 saat çəkir. Prosedur zədələnmiş qığırdaq və sümüyün çıxarılması, sonra yeni metal və plastik oynaq səthlərin yerləşdirilməsini əhatə edir.',
  
  'Knee replacement surgery typically takes 1-2 hours, depending on the complexity of the case. The procedure involves removing damaged cartilage and bone, then positioning the new metal and plastic joint surfaces.',
  
  true, true
),
(
  'Artroskopik cerrahi için iyileşme süresi nedir?',
  'Artroskopik cərrahi üçün sağalma müddəti nədir?',
  'What is the recovery time for arthroscopic surgery?',
  
  'Artroskopik cerrahi için iyileşme süresi prosedüre bağlı olarak değişir, ancak çoğu hasta 1-2 hafta içinde hafif aktivitelere, 4-6 hafta içinde tam aktivitelere dönebilir. Optimal iyileşme için fizik tedavi çok önemlidir.',
  
  'Artroskopik cərrahi üçün sağalma müddəti prosedurdan asılı olaraq dəyişir, lakin əksər xəstələr 1-2 həftə ərzində yüngül fəaliyyətlərə, 4-6 həftə ərzində tam fəaliyyətlərə qayıda bilərlər. Optimal sağalma üçün fiziki terapiya çox vacibdir.',
  
  'Recovery time for arthroscopic surgery varies depending on the procedure, but most patients can return to light activities within 1-2 weeks and full activities within 4-6 weeks. Physical therapy is crucial for optimal recovery.',
  
  true, true
);

-- Sample Symptoms
INSERT INTO symptoms (
  title_tr, title_az, title_en,
  description_tr, description_az, description_en,
  content_tr, content_az, content_en,
  image_url
) VALUES 
(
  'Diz Ağrısı ve Artriti',
  'Diz Ağrısı və Artriti',
  'Knee Pain and Arthritis',
  
  'Diz ağrısı, artrit ve eklem problemleri için kapsamlı tedavi seçenekleri',
  'Diz ağrısı, artrit və oynaq problemləri üçün ətraflı müalicə seçimləri',
  'Comprehensive treatment options for knee pain, arthritis, and joint problems',
  
  '<h2>Diz Ağrısını Anlamak</h2><p>Diz ağrısı, her yaştan insanı etkileyen en yaygın ortopedik şikayetlerden biridir.</p><h3>Yaygın Semptomlar</h3><ul><li>Eklem ağrısı ve sertliği</li><li>Şişlik ve iltihaplanma</li><li>Hareket kısıtlılığı</li></ul>',
  
  '<h2>Diz Ağrısını Başa Düşmək</h2><p>Diz ağrısı hər yaşdan insanları təsir edən ən geniş yayılmış ortopedik şikayətlərdən biridir.</p><h3>Geniş Yayılmış Simptomlar</h3><ul><li>Oynaq ağrısı və sərtliyi</li><li>Şişkinlik və iltihablanma</li><li>Hərəkət məhdudiyyəti</li></ul>',
  
  '<h2>Understanding Knee Pain</h2><p>Knee pain is one of the most common orthopedic complaints affecting people of all ages.</p><h3>Common Symptoms</h3><ul><li>Joint pain and stiffness</li><li>Swelling and inflammation</li><li>Reduced range of motion</li></ul>',
  
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
),
(
  'Omuz Yaralanmaları',
  'Çiyin Zədələri',
  'Shoulder Injuries',
  
  'Rotator cuff yırtıkları, omuz sıkışması ve çıkıklar için tedavi',
  'Rotator cuff cırıqları, çiyin sıxılması və çıxıqlar üçün müalicə',
  'Treatment for rotator cuff tears, shoulder impingement, and dislocations',
  
  '<h2>Omuz Yaralanmalarını Anlamak</h2><p>Omuz yaralanmaları hem atletlerde hem de günlük aktivitelerde yaygındır.</p><h3>Yaygın Omuz Problemleri</h3><ul><li>Rotator cuff yırtıkları</li><li>Omuz sıkışma sendromu</li><li>Omuz çıkığı</li></ul>',
  
  '<h2>Çiyin Zədələrini Başa Düşmək</h2><p>Çiyin zədələri həm atletlərdə, həm də gündəlik fəaliyyətlərdə geniş yayılmışdır.</p><h3>Geniş Yayılmış Çiyin Problemləri</h3><ul><li>Rotator cuff cırıqları</li><li>Çiyin sıxılma sindromu</li><li>Çiyin çıxığı</li></ul>',
  
  '<h2>Understanding Shoulder Injuries</h2><p>Shoulder injuries are common in both athletes and everyday activities.</p><h3>Common Shoulder Problems</h3><ul><li>Rotator cuff tears</li><li>Shoulder impingement syndrome</li><li>Shoulder dislocation</li></ul>',
  
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
);

-- Sample Reviews
INSERT INTO reviews (
  name, message, rating, approved, doctor_reply
) VALUES 
(
  'Ayşe Yılmaz',
  'Dr. Eryanılmaz performed my knee replacement surgery and the results have been amazing. I can walk without pain for the first time in years!',
  5,
  true,
  'Thank you for your kind words, Ayşe. I''m delighted to hear about your excellent progress!'
),
(
  'Mehmet Aslan',
  'Excellent surgeon and very caring doctor. My shoulder surgery was successful and recovery was smooth.',
  5,
  true,
  null
),
(
  'Fatma Özkan',
  'Dr. Eryanılmaz treated my daughter''s hip dysplasia. Professional, experienced, and great with children.',
  5,
  true,
  'It was my pleasure to help your daughter. Children''s health is always our top priority.'
);